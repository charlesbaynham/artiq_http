/**
 * The `live` card (IMPL-SPEC §7, §15, handoff "Column 3 — live pane").
 *
 * The plot itself is the existing `/plots` view, embedded via `PlotsApp`'s
 * `forcedPrefix`/`compact` props rather than reimplemented — see the props
 * passed below. Everything else (status pill, readout row, ghost toggle,
 * copy/fullscreen) is chrome this card owns.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

import PlotsApp from "../../plots/PlotsApp";
import { copyPlotToClipboard } from "../../plots/copyPlot";
import {
  CHANNEL_COLOR_VARS,
  channelPriority,
  defaultVisibleChannels,
  formatNum,
  loadChannelVisibility,
} from "../../plots/utils";
import { isLiveStatus } from "../state/useSchedule";
import { Caption, Mono, PanelHeader, Pill, Spacer } from "../ui/primitives";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/* ── Readout derivation ──────────────────────────────────────────────────── */

/** Channel visibility mirroring PlotsApp's own default+persisted logic, read
 * from the same localStorage key it writes to, so the readout's "primary"
 * channel tracks whatever is actually visible in the embedded plot. */
function computeVisibility(plot) {
  if (!plot?.channels) return {};
  const keys = Object.keys(plot.channels);
  const saved = loadChannelVisibility(plot.fragmentFqn) || {};
  const fallback = defaultVisibleChannels(plot.channels, keys);
  const vis = {};
  for (const k of keys) vis[k] = k in saved ? !!saved[k] : !!fallback[k];
  return vis;
}

function primaryChannelKey(plot) {
  if (!plot?.channels) return null;
  const keys = Object.keys(plot.channels);
  if (!keys.length) return null;
  const vis = computeVisibility(plot);
  const visible = keys.filter((k) => vis[k]);
  const pool = visible.length ? visible : keys;
  return pool.reduce((best, k) =>
    channelPriority(plot.channels[k]) > channelPriority(plot.channels[best])
      ? k
      : best,
  );
}

function standardError(values) {
  const n = values.length;
  if (n < 2) return null;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  return Math.sqrt(variance) / Math.sqrt(n);
}

/**
 * Readout for the newest point of a 1D live run: x (with unit), the primary
 * visible channel's value, and the standard error across repeats at that x.
 * Returns null when there isn't a 1D scan with at least one point yet — the
 * card omits the row entirely rather than printing placeholders.
 */
// ndscan publishes raw SI values while `unit` is a display unit (us, MHz);
// `spec.scale` converts between them. The readout prints the unit, so it has to
// divide too — otherwise a microsecond axis reads "0.000 us". Matches what the
// embedded plot does to its own axis.
function displayScale(spec) {
  const s = Number(spec?.scale);
  return Number.isFinite(s) && s !== 0 ? s : 1;
}

function deriveReadout(plot) {
  if (!plot || plot.dims !== "1D") return null;
  const xs = plot.axisValues?.[0];
  if (!xs || !xs.length) return null;

  const lastIdx = xs.length - 1;
  const axisParam = plot.axes?.[0]?.param;
  const xScale = displayScale(axisParam?.spec);
  const xRaw = xs[lastIdx];
  const x = xRaw / xScale;
  const unit = axisParam?.unit || "";

  const key = primaryChannelKey(plot);
  if (key == null)
    return { x, unit, channelKey: null, value: null, sigma: null };

  const cScale = displayScale(plot.channels?.[key]);
  const values = plot.channelData?.[key]?.values || [];
  const value = values[lastIdx];

  const eps = 1e-9 * Math.max(1, Math.abs(xRaw));
  const atX = [];
  for (let i = 0; i < xs.length; i++) {
    if (Math.abs(xs[i] - xRaw) <= eps) {
      const v = values[i];
      if (Number.isFinite(v)) atX.push(v / cScale);
    }
  }

  return {
    x,
    unit,
    channelKey: key,
    value: Number.isFinite(value) ? value / cScale : null,
    sigma: standardError(atX),
  };
}

function progressLabel(progress) {
  if (!progress) return "";
  const { done, total } = progress;
  return Number.isFinite(total) ? `${done}/${total}` : `${done} pts`;
}

/* ── Component ────────────────────────────────────────────────────────────── */

function LivePlotCard({
  liveRun,
  pinnedMissing,
  pinnedLiveRid,
  onUnpin,
  ghostRid,
  ghostPrefix,
  ghostCandidate,
  onToggleGhost,
  onGhostChange,
  onPlotData,
  expanded,
  onToggleExpanded,
}) {
  const [showRails, setShowRails] = useState(false);
  const [channelsSummary, setChannelsSummary] = useState({
    visible: 0,
    total: 0,
  });

  const cardRef = useRef(null);
  const plotWrapRef = useRef(null);

  const hasPlot = !!liveRun.prefix && !pinnedMissing;

  // Reset the channel summary when the run being watched changes so a stale
  // count from the previous run doesn't linger.
  useEffect(() => {
    setChannelsSummary({ visible: 0, total: 0 });
  }, [liveRun.prefix]);

  // Forward the embedded PlotsApp's raw SSE payload to the host (LivePane),
  // which feeds it back into its own `useLiveRun()` call — see
  // `useLiveRun`'s `feed` option — so the readout row and this plot share
  // one EventSource instead of opening two for the same prefix.
  const prefixForData = liveRun.prefix;
  const handlePlotData = useCallback(
    (rawData) => {
      if (!onPlotData || !prefixForData) return;
      onPlotData(prefixForData, rawData);
    },
    [onPlotData, prefixForData],
  );

  const handleCopy = useCallback(async () => {
    const plotsAppEl = plotWrapRef.current?.querySelector(".plots-app");
    if (!plotsAppEl) return;
    const channels = liveRun.plot?.channels || {};
    const vis = computeVisibility(liveRun.plot);
    const keys = Object.keys(channels).sort();
    const channelDescriptors = keys.map((k, i) => ({
      key: k,
      on: !!vis[k],
      color: `var(${CHANNEL_COLOR_VARS[i % CHANNEL_COLOR_VARS.length]})`,
    }));
    try {
      await copyPlotToClipboard({
        containerEl: plotsAppEl,
        rid: liveRun.rid,
        dims: liveRun.plot?.dims,
        channelDescriptors,
        fragmentFqn: liveRun.plot?.fragmentFqn || "",
      });
    } catch (err) {
      console.error("Failed to copy plot:", err);
    }
  }, [liveRun.rid, liveRun.plot]);

  const expName =
    liveRun.scheduleItem?.expid?.class_name ||
    liveRun.plot?.fragmentFqn ||
    (liveRun.prefix || "").replace(/^ndscan\./, "");

  const isLive = isLiveStatus(liveRun.scheduleItem?.status);
  const readout = useMemo(() => deriveReadout(liveRun.plot), [liveRun.plot]);
  const ghostActive = !!(ghostCandidate && ghostRid === ghostCandidate.rid);

  return (
    <section
      ref={cardRef}
      className={cx("b-card", "bl-live-card", expanded && "is-expanded")}
    >
      <PanelHeader className="bl-live-head">
        <Caption>live</Caption>
        {hasPlot && liveRun.rid != null ? (
          <Mono
            className="bl-live-title"
            title={`RID ${liveRun.rid}${expName ? ` · ${expName}` : ""}`}
          >
            RID {liveRun.rid}
            {expName ? ` · ${expName}` : ""}
          </Mono>
        ) : (
          pinnedMissing && (
            <Mono className="bl-live-title" title={`RID ${pinnedLiveRid}`}>
              RID {pinnedLiveRid}
            </Mono>
          )
        )}
        {hasPlot && liveRun.progress && (
          <Pill status={isLive}>
            {isLive ? "● " : ""}
            {progressLabel(liveRun.progress)}
          </Pill>
        )}
        <Spacer />
        {hasPlot && channelsSummary.total > 0 && (
          <Pill
            active={showRails}
            onClick={() => setShowRails((v) => !v)}
            title="Toggle the channel rail"
          >
            channels {channelsSummary.visible}/{channelsSummary.total}
          </Pill>
        )}
        <button
          type="button"
          className="bl-icon-btn b-mono"
          onClick={handleCopy}
          disabled={!hasPlot}
          title="Copy plot to clipboard"
          aria-label="Copy plot to clipboard"
        >
          ⧉
        </button>
        <button
          type="button"
          className="bl-icon-btn b-mono"
          onClick={onToggleExpanded}
          disabled={!onToggleExpanded}
          title={
            expanded
              ? "Restore the workspace"
              : "Expand the plot to the full workspace"
          }
          aria-label={
            expanded
              ? "Restore the workspace"
              : "Expand the plot to the full workspace"
          }
        >
          ⤢
        </button>
      </PanelHeader>

      <div className="bl-live-body">
        {hasPlot ? (
          <div className="bl-plot-well b-well" ref={plotWrapRef}>
            <PlotsApp
              forcedPrefix={liveRun.prefix}
              showTopBar={false}
              showRails={showRails}
              showImages={false}
              compact
              onChannelsSummary={setChannelsSummary}
              ghostPrefixes={ghostPrefix ? [ghostPrefix] : []}
              onGhostChange={onGhostChange}
              onData={handlePlotData}
            />
          </div>
        ) : (
          <div className="bl-empty b-well">
            <div className="bl-empty__title">
              {pinnedMissing
                ? `No data for RID ${pinnedLiveRid}`
                : "No live run"}
            </div>
            <div className="bl-empty__hint">
              {pinnedMissing ? (
                <>
                  Nothing streaming for that RID.{" "}
                  <button type="button" className="bl-link" onClick={onUnpin}>
                    Follow the newest run
                  </button>{" "}
                  instead.
                </>
              ) : (
                "Submit an experiment or pick a past RID from the queue."
              )}
            </div>
          </div>
        )}

        {hasPlot && readout && (
          <div className="bl-readout">
            <Mono className="bl-readout__item">
              <span className="b-muted">x</span> {formatNum(readout.x)}
              {readout.unit ? ` ${readout.unit}` : ""}
            </Mono>
            {readout.channelKey != null && readout.value != null && (
              <Mono className="bl-readout__item">
                <span className="b-muted">{readout.channelKey}</span>{" "}
                <span className="b-accent">{formatNum(readout.value)}</span>
              </Mono>
            )}
            {readout.sigma != null && (
              <Mono className="bl-readout__item">
                <span className="b-muted">σ</span> {formatNum(readout.sigma)}
              </Mono>
            )}
            <Spacer />
            <Pill
              active={ghostActive}
              quiet={!ghostCandidate && !ghostActive}
              onClick={ghostCandidate ? onToggleGhost : undefined}
              title={
                ghostCandidate
                  ? `Overlay RID ${ghostCandidate.rid} for comparison`
                  : "No other run available to compare"
              }
            >
              ghost{ghostCandidate ? `: ${ghostCandidate.rid}` : ""}
            </Pill>
          </div>
        )}
      </div>
    </section>
  );
}

LivePlotCard.propTypes = {
  liveRun: PropTypes.object.isRequired,
  pinnedMissing: PropTypes.bool,
  pinnedLiveRid: PropTypes.number,
  onUnpin: PropTypes.func,
  ghostRid: PropTypes.number,
  ghostPrefix: PropTypes.string,
  ghostCandidate: PropTypes.object,
  onToggleGhost: PropTypes.func,
  onGhostChange: PropTypes.func,
  // (prefix, rawData) => void — forwards the embedded PlotsApp's raw SSE
  // payload so the host can feed it back into its own useLiveRun() call
  // instead of opening a second EventSource (IMPL-SPEC §7 wave-2 polish).
  onPlotData: PropTypes.func,
  // Shell-level "expand to full workspace" state (BenchApp), replacing the
  // browser Fullscreen API this card used before BenchApp existed.
  expanded: PropTypes.bool,
  onToggleExpanded: PropTypes.func,
};

export default LivePlotCard;
