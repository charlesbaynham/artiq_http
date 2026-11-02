/**
 * Live-run discovery, subscription and progress for the bench (IMPL-SPEC §6).
 *
 * Progress (`41/101`) does not exist server-side; it is derived here from the
 * running schedule item's `ndscan_params` where possible, then from the
 * dataset axis descriptors, and otherwise reported honestly as `N pts` with no
 * denominator.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { get_dataset_names } from "../../api/client";
import { SSEState, useSSEDataset } from "../../hooks/useSSEDataset";
import { extractRid, parsePlotData } from "../../plots/utils";
import { isLiveStatus } from "./useSchedule";

export const RUNS_POLL_MS = 5000;
export const INFINITE_REPEATS = 2147483647;
/** Fallback seconds/point when nothing has been measured yet. */
export const DEFAULT_POINT_SECONDS = 1;

/* ── Run discovery ────────────────────────────────────────────────────────── */

/** Turn a dataset name list into `[{prefix, rid}]`, newest RID first. */
export function runsFromDatasetNames(names) {
  return (names || [])
    .filter((n) => typeof n === "string" && n.endsWith(".axes"))
    .map((n) => n.replace(/\.axes$/, ""))
    .map((prefix) => ({ prefix, rid: extractRid(prefix) }))
    .sort((a, b) => {
      if (a.rid != null && b.rid != null) return b.rid - a.rid;
      return b.prefix.localeCompare(a.prefix);
    });
}

/**
 * Discover ndscan runs by looking for dataset names ending `.axes`.
 * @returns {{runs: Array<{prefix: string, rid: number|null}>, error: string|null, loading: boolean, refresh: () => void}}
 */
export function useNdscanRuns() {
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await get_dataset_names();
      if (!mountedRef.current) return;
      const next = runsFromDatasetNames(data?.names);
      setRuns((prev) =>
        prev.length === next.length &&
        prev.every((r, i) => r.prefix === next[i].prefix)
          ? prev
          : next,
      );
      setError(null);
    } catch (err) {
      if (mountedRef.current) setError(err?.message || String(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, RUNS_POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { runs, error, loading, refresh };
}

/* ── Progress derivation ──────────────────────────────────────────────────── */

function pointsInRange(range) {
  if (!range || typeof range !== "object") return null;
  if (Array.isArray(range.values)) return range.values.length;
  if (Number.isFinite(range.num_points)) return range.num_points;
  return null;
}

/** Total points declared by a running item's `expid.arguments.ndscan_params`. */
export function totalFromNdscanParams(scheduleItem) {
  const raw = scheduleItem?.expid?.arguments?.ndscan_params;
  if (!raw) return null;
  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  const scan = parsed?.scan;
  if (!scan) return null;

  const axes = Array.isArray(scan.axes) ? scan.axes : [];
  let product = 1;
  for (const axis of axes) {
    const n = pointsInRange(axis?.range);
    if (!Number.isFinite(n) || n <= 0) return null;
    product *= n;
  }

  const repeats = scan.num_repeats;
  if (repeats === INFINITE_REPEATS) return Infinity;
  if (Number.isFinite(repeats) && repeats > 0) product *= repeats;
  return product;
}

/** Total points implied by the `<prefix>.axes` dataset descriptors. */
export function totalFromAxisDescriptors(plot) {
  const axes = plot?.axes;
  if (!Array.isArray(axes) || axes.length === 0) return null;
  let product = 1;
  for (const axis of axes) {
    const { min, max, increment } = axis || {};
    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      !Number.isFinite(increment) ||
      increment === 0
    ) {
      return null;
    }
    const n = Math.round((max - min) / increment) + 1;
    if (!Number.isFinite(n) || n <= 0) return null;
    product *= n;
  }
  return product;
}

/**
 * Derive `{done, total, fraction, remainingSeconds, secondsPerPoint}` for a run.
 *
 * `timing` is measured client-side (there is no server-side timing): pass
 * `{startedAt, startedDone, now}` in ms/points as observed since this session
 * started watching the run. Without it the estimate is omitted rather than
 * guessed.
 *
 * `total` is `null` when no honest denominator exists — render `N pts`, never
 * `N/?`. `total` is `Infinity` for an ∞-repeat scan.
 *
 * @param {object|null} scheduleItem
 * @param {object|null} plot - the `parsePlotData` result
 * @param {{startedAt?: number, startedDone?: number, now?: number}} [timing]
 */
export function runProgress(scheduleItem, plot, timing = null) {
  const done = plot?.axisValues?.[0]?.length ?? 0;

  let total = totalFromNdscanParams(scheduleItem);
  if (total == null) total = totalFromAxisDescriptors(plot);
  if (total != null && !Number.isFinite(total) && total !== Infinity) {
    total = null;
  }

  const finiteTotal = Number.isFinite(total) ? total : null;
  const fraction =
    finiteTotal && finiteTotal > 0
      ? Math.max(0, Math.min(1, done / finiteTotal))
      : null;

  let secondsPerPoint = null;
  if (
    timing &&
    Number.isFinite(timing.startedAt) &&
    Number.isFinite(timing.startedDone)
  ) {
    const now = Number.isFinite(timing.now) ? timing.now : Date.now();
    const deltaPoints = done - timing.startedDone;
    const elapsed = (now - timing.startedAt) / 1000;
    if (deltaPoints > 0 && elapsed > 0) secondsPerPoint = elapsed / deltaPoints;
  }

  const remainingSeconds =
    secondsPerPoint != null && finiteTotal != null && finiteTotal > done
      ? secondsPerPoint * (finiteTotal - done)
      : null;

  return { done, total, fraction, remainingSeconds, secondsPerPoint };
}

/* ── Formatting ───────────────────────────────────────────────────────────── */

/**
 * `formatDuration(112)` → `"1m52s"`; `formatDuration(112, {spaced: true})` →
 * `"1 m 52 s"`. Returns `""` for null/non-finite input.
 *
 * @param {number|null} seconds
 * @param {{spaced?: boolean}} [opts]
 */
export function formatDuration(seconds, { spaced = false } = {}) {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return "";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const join = spaced ? " " : "";
  const unit = (n, u) => (spaced ? `${n} ${u}` : `${n}${u}`);

  const parts = [];
  if (h) parts.push(unit(h, "h"));
  if (h || m) parts.push(unit(m, "m"));
  parts.push(unit(s, "s"));
  return parts.join(join);
}

/**
 * Seconds per scan point to use for the submit footer's `≈ 7 m 42 s`.
 * Prefers the value measured from the live run; falls back to a constant so
 * the footer always shows something.
 *
 * @param {{secondsPerPoint?: number|null}|number|null} progressOrSeconds
 * @param {number} [fallback]
 */
export function estimatePointDuration(
  progressOrSeconds,
  fallback = DEFAULT_POINT_SECONDS,
) {
  const measured =
    typeof progressOrSeconds === "number"
      ? progressOrSeconds
      : progressOrSeconds?.secondsPerPoint;
  return Number.isFinite(measured) && measured > 0 ? measured : fallback;
}

/* ── The hook ─────────────────────────────────────────────────────────────── */

/**
 * Resolve which run the live pane should show and subscribe to it.
 *
 * Resolution order: `pinnedRid` (or `rid`) → the newest *running* run →
 * the newest run at all.
 *
 * `feed` lets a caller that already has this run's raw SSE payload from
 * elsewhere (e.g. an embedded `PlotsApp`'s `onData` callback) supply it
 * directly instead of this hook opening its own second `EventSource` to the
 * same prefix — see `LivePane`/`LivePlotCard`, which is the one place this
 * is used today. When `feed.prefix` matches the resolved prefix, this hook's
 * own subscription is disabled and `feed.data`/`feed.error` are used in its
 * place; otherwise (no feed, or a feed for a different prefix — e.g. right
 * after the watched run changes, before the feeder has caught up) it falls
 * back to subscribing itself, so behaviour for every other caller (mobile,
 * TopBar, SubmitPane, …) is unchanged.
 *
 * @param {{rid?: number|null, pinnedRid?: number|null, scheduleItems?: Array<object>,
 *           enabled?: boolean, feed?: {prefix: string, data: object|null, error?: string|null}|null}} [opts]
 * @returns {{prefix: string|null, rid: number|null, run: object|null, runs: Array<object>,
 *            data: object|null, plot: object|null, scheduleItem: object|null,
 *            status: string|null, progress: object, channels: object|null,
 *            error: string|null, connectionState: string}}
 */
export function useLiveRun({
  rid = null,
  pinnedRid = null,
  scheduleItems = [],
  enabled = true,
  feed = null,
} = {}) {
  const { runs, error: discoveryError } = useNdscanRuns();

  const wantedRid = pinnedRid ?? rid ?? null;

  const runningRids = useMemo(
    () =>
      (scheduleItems || [])
        .filter((i) => isLiveStatus(i.status))
        .map((i) => Number(i.rid))
        .filter((n) => Number.isFinite(n)),
    [scheduleItems],
  );

  const run = useMemo(() => {
    if (!runs.length) return null;
    if (wantedRid != null) {
      const pinned = runs.find((r) => r.rid === Number(wantedRid));
      if (pinned) return pinned;
    }
    // Newest running run (runs are already sorted newest-first).
    const live = runs.find((r) => r.rid != null && runningRids.includes(r.rid));
    if (live) return live;
    return runs[0];
  }, [runs, wantedRid, runningRids]);

  const prefix = run?.prefix ?? null;

  const feedMatches = !!(feed && prefix != null && feed.prefix === prefix);

  const {
    data: ownData,
    error: ownSseError,
    connectionState: ownConnectionState,
  } = useSSEDataset(prefix, { enabled: enabled && !!prefix && !feedMatches });

  const data = feedMatches ? feed.data : ownData;
  const sseError = feedMatches ? (feed.error ?? null) : ownSseError;
  // The feed's own subscription state isn't ours to see, but its presence
  // implies "connected enough to have data" once it has delivered anything;
  // before that, report CONNECTING rather than guessing further.
  const connectionState = feedMatches
    ? feed.data
      ? SSEState.CONNECTED
      : SSEState.CONNECTING
    : ownConnectionState;

  const plot = useMemo(() => parsePlotData(data, prefix), [data, prefix]);

  const scheduleItem = useMemo(() => {
    if (run?.rid == null) return null;
    return (scheduleItems || []).find((i) => Number(i.rid) === run.rid) || null;
  }, [scheduleItems, run]);

  // Client-side timing baseline: reset whenever the watched run changes.
  const timingRef = useRef(null);
  const done = plot?.axisValues?.[0]?.length ?? 0;
  const prefixRef = useRef(prefix);
  if (prefixRef.current !== prefix) {
    prefixRef.current = prefix;
    timingRef.current = null;
  }
  if (timingRef.current == null && done > 0) {
    timingRef.current = { startedAt: Date.now(), startedDone: done };
  }

  const progress = useMemo(
    () => runProgress(scheduleItem, plot, timingRef.current),
    [scheduleItem, plot],
  );

  const status = useMemo(() => {
    if (scheduleItem?.status) return scheduleItem.status;
    if (plot?.completed) return "completed";
    return null;
  }, [scheduleItem, plot]);

  return {
    prefix,
    rid: run?.rid ?? null,
    run,
    runs,
    data,
    plot,
    scheduleItem,
    status,
    progress,
    channels: plot?.channels ?? null,
    error: sseError || discoveryError || null,
    connectionState,
  };
}

export default useLiveRun;
