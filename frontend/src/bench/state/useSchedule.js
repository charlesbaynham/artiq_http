/**
 * Schedule / queue polling for the bench.
 *
 * `get_schedule()` returns `{ "<rid>": ScheduleItem }`. We poll it every second
 * (as the legacy `Schedule.jsx` does) but pause while the tab is hidden and
 * refresh immediately on `visibilitychange` — the same pattern `Logs.jsx` uses.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cancel_rid, get_schedule } from "../../api/client";

export const POLL_MS = 1000;

/**
 * Statuses ARTIQ reports for a run that has left the queue. `running` and
 * `analyzing` are treated as *live*; the rest still count as in-flight but
 * render in the queue (IMPL-SPEC §6).
 */
export const ACTIVE_STATUSES = [
  "running",
  "analyzing",
  "run_done",
  "preparing",
  "pause_requested",
  "flushing",
];

export const LIVE_STATUSES = ["running", "analyzing"];

export function isLiveStatus(status) {
  return LIVE_STATUSES.includes(status);
}

export function isActiveStatus(status) {
  return ACTIVE_STATUSES.includes(status);
}

/** `{rid: item}` → `[{rid, ...item}]` sorted by RID descending. */
export function scheduleToItems(schedule) {
  if (!schedule) return [];
  return Object.entries(schedule)
    .map(([rid, item]) => ({ ...item, rid: Number(rid) }))
    .sort((a, b) => b.rid - a.rid);
}

/**
 * @returns {{
 *   schedule: object,
 *   items: Array<object>,
 *   running: Array<object>,
 *   queued: Array<object>,
 *   error: string|null,
 *   loading: boolean,
 *   refresh: () => Promise<void>,
 *   cancel: (rid: number, force?: boolean) => Promise<any>,
 * }}
 */
export function useSchedule() {
  const [schedule, setSchedule] = useState({});
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
      const data = await get_schedule();
      if (!mountedRef.current) return;
      setSchedule(data || {});
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err?.message || String(err));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // Poll, but only while the tab is visible.
  useEffect(() => {
    refresh();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  // Catch up the moment the tab comes back.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refresh]);

  const cancel = useCallback(
    async (rid, force = false) => {
      const result = await cancel_rid(rid, force);
      refresh();
      return result;
    },
    [refresh],
  );

  const items = useMemo(() => scheduleToItems(schedule), [schedule]);
  const running = useMemo(
    () => items.filter((i) => isLiveStatus(i.status)),
    [items],
  );
  const queued = useMemo(
    () => items.filter((i) => !isLiveStatus(i.status)),
    [items],
  );

  return { schedule, items, running, queued, error, loading, refresh, cancel };
}

export default useSchedule;
