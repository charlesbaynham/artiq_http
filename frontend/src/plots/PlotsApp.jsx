import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import { get_dataset_names, get_dataset_values } from "../api/client";
import { useSSEDataset, SSEState } from "../hooks/useSSEDataset";
import TopBar from "./TopBar";
import ChannelsRail from "./ChannelsRail";
import TimelineRail from "./TimelineRail";
import DimBadge from "./DimBadge";
import Plot1D from "./Plot1D";
import Plot2D from "./Plot2D";
import Plot0D from "./Plot0D";
import {
  CHANNEL_COLOR_VARS,
  extractRid,
  loadChannelVisibility,
  saveChannelVisibility,
} from "./utils";
import { groupChannels } from "./grouping";
import { copyPlotToClipboard } from "./copyPlot";
import ImageSection from "./ImageSection";

import "./tokens.css";

const REFRESH_MS = 5000;

// Convert the raw SSE dataset bag into the structured form the plot components
// expect. Returns null until both axes & channels are present.
function parsePlotData(rawData, prefix) {
  if (!rawData) return null;
  try {
    const axesEntry = rawData[`${prefix}.axes`];
    const channelsEntry = rawData[`${prefix}.channels`];
    if (!axesEntry || !channelsEntry) return null;

    const axes = JSON.parse(axesEntry[1]);
    const channels = JSON.parse(channelsEntry[1]);
    const completed = rawData[`${prefix}.completed`]?.[1] ?? false;
    const fragmentFqn = rawData[`${prefix}.fragment_fqn`]?.[1] || null;

    // Pull axis values (1D/2D).
    const axisValues = axes.map(
      (_, i) => rawData[`${prefix}.points.axis_${i}`]?.[1] || [],
    );

    // Build per-channel arrays.
    const channelData = {};
    for (const key of Object.keys(channels)) {
      const arr = rawData[`${prefix}.points.channel_${key}`]?.[1];
      const pt = rawData[`${prefix}.point.${key}`]?.[1];
      channelData[key] = { values: arr || [], point: pt };
    }

    return {
      prefix,
      axes,
      channels,
      channelData,
      axisValues,
      completed,
      fragmentFqn,
      dims: `${axes.length}D`,
    };
  } catch (err) {
    console.error("Failed to parse plot data for", prefix, err);
    return null;
  }
}

function axisLabel(axis) {
  if (!axis) return "";
  const p = axis.param || {};
  const base = p.description || p.fqn || "axis";
  const unit = p.unit;
  return unit ? `${base} / ${unit}` : base;
}

function channelUnit(spec) {
  if (!spec || typeof spec !== "object") return "";
  const unit = spec.unit;
  if (unit) return `${spec.type || ""}${spec.type ? " · " : ""}${unit}`.trim();
  return spec.type || "";
}

function PlotsApp() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Discover available scans ─────────────────────────────────────────────
  const [prefixes, setPrefixes] = useState([]);
  const [prefixMeta, setPrefixMeta] = useState({}); // prefix -> { fragmentFqn, dims }
  const [discoveryError, setDiscoveryError] = useState(null);
  const [discoveryLoaded, setDiscoveryLoaded] = useState(false);

  const refreshScans = useCallback(async () => {
    try {
      const data = await get_dataset_names();
      const names = data.names || [];
      const discovered = names
        .filter((n) => n.endsWith(".axes"))
        .map((n) => n.replace(/\.axes$/, ""))
        .sort((a, b) => {
          const rA = extractRid(a),
            rB = extractRid(b);
          if (rA != null && rB != null) return rB - rA;
          return b.localeCompare(a);
        });

      if (discovered.length === 0) {
        setPrefixes((prev) => (prev.length === 0 ? prev : []));
        setPrefixMeta({});
        setDiscoveryError(null);
        return;
      }

      // Fetch metadata (fragment_fqn + axes) for each prefix in one call.
      const queries = discovered.flatMap((p) => [
        `${p}.fragment_fqn`,
        `${p}.axes`,
      ]);
      const values = await get_dataset_values(queries);
      const meta = {};
      for (const p of discovered) {
        const fqnEntry = values[`${p}.fragment_fqn`];
        const axesEntry = values[`${p}.axes`];
        let dims = null;
        if (axesEntry) {
          try {
            const axes = JSON.parse(axesEntry[1]);
            dims = `${axes.length}D`;
          } catch {
            /* leave unknown */
          }
        }
        meta[p] = {
          fragmentFqn: fqnEntry ? fqnEntry[1] : null,
          dims,
        };
      }

      setPrefixes((prev) =>
        JSON.stringify(prev) === JSON.stringify(discovered) ? prev : discovered,
      );
      setPrefixMeta(meta);
      setDiscoveryError(null);
    } catch (err) {
      setDiscoveryError(err.message || String(err));
    } finally {
      setDiscoveryLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshScans();
    const id = setInterval(refreshScans, REFRESH_MS);
    return () => clearInterval(id);
  }, [refreshScans]);

  // Build recent-runs list grouped by fragment_fqn.
  const recentRuns = useMemo(() => {
    return prefixes.map((p) => {
      const m = prefixMeta[p] || {};
      const fqn = m.fragmentFqn;
      const expName = fqn || p.replace(/^ndscan\./, "");
      return {
        prefix: p,
        rid: extractRid(p),
        dims: m.dims,
        expName,
        fragmentFqn: fqn,
      };
    });
  }, [prefixes, prefixMeta]);

  // ── Active selection ────────────────────────────────────────────────────
  const [activePrefix, setActivePrefix] = useState(null);
  // Sync with ?scan= query param.
  useEffect(() => {
    const fromUrl = searchParams.get("scan");
    if (fromUrl) {
      setActivePrefix((cur) => (cur === fromUrl ? cur : fromUrl));
      return;
    }
    if (recentRuns.length && !activePrefix) {
      setActivePrefix(recentRuns[0].prefix);
    }
  }, [searchParams, recentRuns, activePrefix]);

  const handlePick = useCallback(
    (run) => {
      setActivePrefix(run.prefix);
      const next = new URLSearchParams(searchParams);
      next.set("scan", run.prefix);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // ── SSE stream for the active run ───────────────────────────────────────
  const {
    data: rawActiveData,
    connectionState,
    error: sseError,
  } = useSSEDataset(activePrefix, { enabled: !!activePrefix });

  const active = useMemo(
    () => parsePlotData(rawActiveData, activePrefix),
    [rawActiveData, activePrefix],
  );

  const dims = active?.dims || prefixMeta[activePrefix]?.dims || null;
  const fragmentFqn =
    active?.fragmentFqn || prefixMeta[activePrefix]?.fragmentFqn || null;
  const expName = fragmentFqn || (activePrefix || "").replace(/^ndscan\./, "");

  // ── Channel visibility (persisted per fragment_fqn) ─────────────────────
  // Stable identity for the channel-key list. Each SSE update produces a new
  // `active` object reference, so we key off the joined string to avoid
  // re-running downstream effects when the set of keys hasn't actually changed.
  const channelKeysSig = active?.channels
    ? Object.keys(active.channels).sort().join("\0")
    : "";
  const channelKeys = useMemo(
    () => (channelKeysSig ? channelKeysSig.split("\0") : []),
    [channelKeysSig],
  );

  const [visibility, setVisibility] = useState({});
  // Load saved visibility when the active experiment changes.
  useEffect(() => {
    if (!channelKeys.length) return;
    const saved = loadChannelVisibility(fragmentFqn);
    setVisibility((prev) => {
      let changed = false;
      const next = { ...prev };
      for (let i = 0; i < channelKeys.length; i++) {
        const k = channelKeys[i];
        if (saved && k in saved) {
          const val = !!saved[k];
          if (next[k] !== val) {
            next[k] = val;
            changed = true;
          }
        } else if (!(k in next)) {
          // Default: first three channels visible.
          next[k] = i < 3;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [fragmentFqn, channelKeys]);

  const toggleChannel = useCallback(
    (key) => {
      setVisibility((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        saveChannelVisibility(fragmentFqn, next);
        return next;
      });
    },
    [fragmentFqn],
  );

  // ── 2D metric selection (single channel) ────────────────────────────────
  const [metric2D, setMetric2D] = useState(null);
  useEffect(() => {
    if (
      dims === "2D" &&
      channelKeys.length &&
      !channelKeys.includes(metric2D)
    ) {
      setMetric2D(channelKeys[0]);
    }
  }, [dims, channelKeys, metric2D]);

  // ── 0D local timeseries (accumulate point.* updates for repeat mode) ───
  // The server only keeps the last point in repeat mode, so we build a local
  // history from SSE updates since the view was opened.
  const [history0D, setHistory0D] = useState([]); // [{t: ms, snap: {key: value}}]
  const prevPoint0DRef = useRef(null);

  // Reset history when the active run changes.
  useEffect(() => {
    setHistory0D([]);
    prevPoint0DRef.current = null;
  }, [activePrefix]);

  // Append to history whenever 0D point values change.
  useEffect(() => {
    if (!active || active.axes.length !== 0) return;
    const keys = Object.keys(active.channels);
    const snap = {};
    let hasAny = false;
    for (const k of keys) {
      const v = rawActiveData?.[`${activePrefix}.point.${k}`]?.[1];
      if (v !== undefined) {
        snap[k] = v;
        hasAny = true;
      }
    }
    if (!hasAny) return;
    const prev = prevPoint0DRef.current;
    if (!prev || keys.some((k) => snap[k] !== prev[k])) {
      prevPoint0DRef.current = snap;
      setHistory0D((h) => [...h, { t: Date.now(), snap }]);
    }
  }, [rawActiveData, active, activePrefix]);

  // Derive xs (elapsed seconds) and per-channel arrays from local history.
  const timeseries0D = useMemo(() => {
    if (!active || active.axes.length !== 0 || history0D.length === 0)
      return null;
    const t0 = history0D[0].t;
    const xs = history0D.map((pt) => (pt.t - t0) / 1000);
    const channelValues = {};
    for (const k of Object.keys(active.channels)) {
      channelValues[k] = history0D.map((pt) => pt.snap[k]);
    }
    return { xs, channelValues };
  }, [history0D, active]);

  // ── Build channel descriptors with resolved colors ──────────────────────
  const channelDescriptors = useMemo(() => {
    if (!active) return [];
    return channelKeys.map((key, i) => {
      const spec = active.channels[key] || {};
      const cdata = active.channelData[key] || {};
      const colorVar = CHANNEL_COLOR_VARS[i % CHANNEL_COLOR_VARS.length];
      const isMetric = dims === "2D" && key === metric2D;
      const on = dims === "2D" ? isMetric : !!visibility[key];
      return {
        key,
        on,
        color: `var(${colorVar})`,
        unit: channelUnit(spec),
        values: cdata.values || [],
        point: cdata.point,
      };
    });
  }, [active, channelKeys, visibility, dims, metric2D]);

  // ── Channel grouping into separate stacked plots ─────────────────────────
  // The descriptor list fed into Plot1D for the current mode (1D scan, or the
  // 0D-repeat elapsed-time series), with values resolved appropriately. Null
  // for modes that don't use Plot1D (2D, or 0D before any history exists).
  const plot1dChannels = useMemo(() => {
    if (dims === "1D") return channelDescriptors;
    if (dims === "0D" && timeseries0D) {
      return channelDescriptors.map((c) => ({
        ...c,
        values: timeseries0D.channelValues[c.key] || [],
      }));
    }
    return null;
  }, [dims, channelDescriptors, timeseries0D]);

  // Group channels (by ndscan share_axis_with hints, else by scale) so that
  // unrelated scales don't get crushed onto one shared y-axis.
  const channelGroups = useMemo(() => {
    if (!active || !active.channels || !plot1dChannels) return [];
    const valuesByKey = {};
    for (const c of plot1dChannels) valuesByKey[c.key] = c.values;
    return groupChannels(active.channels, valuesByKey);
  }, [active, plot1dChannels]);

  // Resolve groups to descriptor subsets, keeping only groups with at least one
  // visible channel (in render order). These are the plots actually drawn, and
  // are also handed to the clipboard exporter so its per-plot legends match.
  const renderGroups = useMemo(() => {
    if (!plot1dChannels) return null;
    const byKey = new Map(plot1dChannels.map((d) => [d.key, d]));
    const groups = channelGroups
      .map((keys) => keys.map((k) => byKey.get(k)).filter(Boolean))
      .filter((descs) => descs.some((d) => d.on));
    if (!groups.length) {
      const visible = plot1dChannels.filter((d) => d.on);
      if (visible.length) return [visible];
    }
    return groups;
  }, [channelGroups, plot1dChannels]);

  const primaryChannelKey = plot1dChannels?.[0]?.key ?? null;

  // ── Native fullscreen for the plot panel ────────────────────────────────
  const plotPanelRef = useRef(null);
  const [isPlotFullscreen, setIsPlotFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsPlotFullscreen(document.fullscreenElement === plotPanelRef.current);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handlePlotFullscreen = useCallback(() => {
    if (isPlotFullscreen) {
      document.exitFullscreen().catch(console.error);
    } else if (plotPanelRef.current) {
      plotPanelRef.current.requestFullscreen().catch(console.error);
    }
  }, [isPlotFullscreen]);

  // ── Copy plot to clipboard ───────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    if (!plotPanelRef.current || !dims) throw new Error("No plot to copy");
    await copyPlotToClipboard({
      containerEl: plotPanelRef.current,
      rid: extractRid(activePrefix || ""),
      dims,
      channelDescriptors,
      channelGroups: renderGroups,
    });
  }, [activePrefix, dims, channelDescriptors, renderGroups]);

  // ── Timeline — show all recent runs ─────────────────────────────────────
  const timelineRuns = recentRuns;

  // ── Ghost overlays — fetch raw values lazily for selected ghost prefixes ─
  const [ghostPrefixes, setGhostPrefixes] = useState([]);
  // Reset ghosts when the active run changes.
  useEffect(() => {
    setGhostPrefixes([]);
  }, [activePrefix]);
  const toggleGhost = useCallback((prefix) => {
    setGhostPrefixes((prev) =>
      prev.includes(prefix)
        ? prev.filter((p) => p !== prefix)
        : [...prev, prefix],
    );
  }, []);

  const [ghostData, setGhostData] = useState({}); // prefix -> { xs, channels }
  // Reset ghost cache when the active run changes; keeping it across runs
  // would re-render with stale x-axes when switching experiments.
  useEffect(() => {
    setGhostData((prev) => (Object.keys(prev).length === 0 ? prev : {}));
  }, [activePrefix]);

  const ghostPrefixesSig = ghostPrefixes.join(" ");
  useEffect(() => {
    if (dims !== "1D" || ghostPrefixes.length === 0) return;
    let cancelled = false;
    async function loadGhosts() {
      const needed = ghostPrefixes.filter((p) => !ghostData[p]);
      if (!needed.length) return;
      try {
        // Each ghost needs axis_0 + per-channel values. We fetch the primary
        // channel for ghost rendering — keeping payloads small.
        const queries = needed.flatMap((p) => [
          `${p}.points.axis_0`,
          ...channelKeys.map((k) => `${p}.points.channel_${k}`),
        ]);
        const vals = await get_dataset_values(queries);
        if (cancelled) return;
        setGhostData((prev) => {
          const next = { ...prev };
          for (const p of needed) {
            const xs = vals[`${p}.points.axis_0`]?.[1] || [];
            const primary = channelKeys[0];
            const values = primary
              ? vals[`${p}.points.channel_${primary}`]?.[1] || []
              : [];
            next[p] = { xs, values, rid: extractRid(p) };
          }
          return next;
        });
      } catch (err) {
        console.error("Failed to load ghost data:", err);
      }
    }
    loadGhosts();
    return () => {
      cancelled = true;
    };
    // Intentionally omit ghostData from deps to avoid re-firing on each update;
    // we re-key off the prefixes signature instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ghostPrefixesSig, channelKeysSig, dims]);

  const ghostsForPlot = useMemo(() => {
    if (dims !== "1D") return [];
    return ghostPrefixes
      .map((p) => ghostData[p])
      .filter((g) => g && g.values && g.values.length);
  }, [ghostPrefixes, ghostData, dims]);

  // ── Status string for the top bar ────────────────────────────────────────
  const status = useMemo(() => {
    if (!activePrefix) return null;
    if (connectionState === SSEState.ERROR) return "error";
    if (
      connectionState === SSEState.CONNECTING ||
      connectionState === SSEState.RECONNECTING
    )
      return "connecting";
    if (active?.completed) return "done";
    return "live";
  }, [activePrefix, connectionState, active]);

  const progressLabel = useMemo(() => {
    if (!active) return "";
    if (dims === "1D" || dims === "2D") {
      const pts = active.axisValues[0]?.length || 0;
      return `${pts} pts`;
    }
    if (dims === "0D" && history0D.length > 0) {
      return `${history0D.length} pts`;
    }
    return "streaming";
  }, [active, dims, history0D]);

  // ── Empty state ──────────────────────────────────────────────────────────
  if (discoveryLoaded && recentRuns.length === 0) {
    return (
      <div className="plots-app">
        <TopBar
          recentRuns={[]}
          currentPrefix={null}
          onPick={() => {}}
          status={null}
          progress={null}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            flexDirection: "column",
            gap: 8,
            color: "var(--p-ink50)",
            fontSize: 13,
          }}
        >
          <div className="p-lbl">idle</div>
          <div>No NDScans currently in the store.</div>
          {discoveryError && (
            <div style={{ color: "var(--p-err)", fontSize: 11 }}>
              {discoveryError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="plots-app">
      <TopBar
        recentRuns={recentRuns}
        currentPrefix={activePrefix}
        onPick={handlePick}
        progress={progressLabel}
        status={status}
        onCopy={active ? handleCopy : undefined}
      />

      <div className="p-work">
        <ChannelsRail
          mode={dims || "1D"}
          channels={channelDescriptors}
          onToggle={toggleChannel}
          onPickMetric={setMetric2D}
          experiment={fragmentFqn}
          saved={!!fragmentFqn}
        />

        <div className="p-center">
          <ActiveHeader
            prefix={activePrefix}
            rid={extractRid(activePrefix || "")}
            fragmentFqn={fragmentFqn}
            dims={dims}
          />
          <div
            ref={plotPanelRef}
            className="p-panel p-plot-panel"
            style={{
              flex: 1,
              padding: 0,
              position: "relative",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <PlotBody
              active={active}
              dims={dims}
              channelDescriptors={channelDescriptors}
              renderGroups={renderGroups}
              primaryChannelKey={primaryChannelKey}
              metric2D={metric2D}
              ghosts={ghostsForPlot}
              status={status}
              sseError={sseError}
              timeseries0D={timeseries0D}
            />
            <button
              className="p-btn ghost icon"
              title={
                isPlotFullscreen ? "Exit fullscreen" : "Fullscreen (plot only)"
              }
              aria-label={
                isPlotFullscreen ? "exit fullscreen" : "open plot fullscreen"
              }
              onClick={handlePlotFullscreen}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                zIndex: 10,
              }}
            >
              {isPlotFullscreen ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="10" y1="14" x2="3" y2="21" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              )}
            </button>
          </div>
          <ImageSection />
        </div>

        <TimelineRail
          experiment={expName}
          runs={timelineRuns}
          activeRid={extractRid(activePrefix || "")}
          ghostPrefixes={ghostPrefixes}
          onToggleGhost={toggleGhost}
          onPick={handlePick}
          dims={dims}
        />
      </div>
    </div>
  );
}

function ActiveHeader({ prefix, rid, fragmentFqn, dims }) {
  if (!prefix) {
    return (
      <div
        className="p-panel"
        style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          minHeight: 40,
        }}
      >
        <span className="p-lbl">no run selected</span>
      </div>
    );
  }
  return (
    <div
      className="p-panel"
      style={{
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minHeight: 40,
        flexWrap: "nowrap",
        overflow: "hidden",
      }}
    >
      <span className="p-lbl">active</span>
      {dims && <DimBadge dims={dims} accent />}
      {rid != null && (
        <span
          className="p-mono"
          style={{
            color: "var(--p-accent)",
            fontWeight: 600,
            flex: "0 0 auto",
          }}
        >
          #{rid}
        </span>
      )}
      <span
        className="p-mono p-dim"
        style={{
          fontSize: 11,
          flex: "1 1 auto",
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={fragmentFqn || prefix}
      >
        {fragmentFqn || prefix}
      </span>
    </div>
  );
}

// Render one Plot1D per channel group, stacked vertically. `groups` is an array
// of descriptor arrays (already filtered to groups that have a visible channel).
// A single group fills the panel; multiple groups stack and scroll so each keeps
// its own independent y-scale.
function StackedPlots1D({
  groups,
  xs,
  xLabel,
  scanned,
  ghosts,
  primaryChannelKey,
}) {
  if (!groups || !groups.length) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-ink50)",
          fontSize: 12,
        }}
      >
        No channels visible.
      </div>
    );
  }
  const single = groups.length === 1;
  return (
    <div
      style={{
        height: "100%",
        overflowY: single ? "hidden" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {groups.map((descs) => {
        const key = descs.map((d) => d.key).join("|");
        const hasPrimary =
          primaryChannelKey != null &&
          descs.some((d) => d.key === primaryChannelKey);
        return (
          <div
            key={key}
            style={{
              flex: single ? 1 : "1 1 0",
              minHeight: single ? 0 : 160,
            }}
          >
            <Plot1D
              xs={xs}
              xLabel={xLabel}
              yLabel="value"
              channels={descs}
              ghosts={hasPrimary ? ghosts : []}
              scanned={scanned}
            />
          </div>
        );
      })}
    </div>
  );
}

StackedPlots1D.propTypes = {
  groups: PropTypes.array,
  xs: PropTypes.array.isRequired,
  xLabel: PropTypes.string,
  scanned: PropTypes.bool,
  ghosts: PropTypes.array,
  primaryChannelKey: PropTypes.string,
};

function PlotBody({
  active,
  dims,
  channelDescriptors,
  renderGroups,
  primaryChannelKey,
  metric2D,
  ghosts,
  status,
  sseError,
  timeseries0D,
}) {
  if (status === "connecting" && !active) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-ink50)",
          fontSize: 12,
        }}
      >
        Connecting…
      </div>
    );
  }
  if (status === "error" && !active) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-err)",
          fontSize: 12,
          padding: 24,
          textAlign: "center",
        }}
      >
        {sseError || "Connection error"}
      </div>
    );
  }
  if (!active) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--p-ink50)",
          fontSize: 12,
        }}
      >
        Waiting for data…
      </div>
    );
  }

  if (dims === "0D") {
    if (timeseries0D && timeseries0D.xs.length > 1) {
      return (
        <StackedPlots1D
          groups={renderGroups}
          xs={timeseries0D.xs}
          xLabel="elapsed / s"
          scanned={false}
          ghosts={[]}
          primaryChannelKey={primaryChannelKey}
        />
      );
    }
    const channels = channelDescriptors.map((c) => ({
      ...c,
      value: c.point,
    }));
    return <Plot0D channels={channels} />;
  }
  if (dims === "1D") {
    const xs = active.axisValues[0] || [];
    const axis = active.axes[0];
    return (
      <StackedPlots1D
        groups={renderGroups}
        xs={xs}
        xLabel={axisLabel(axis)}
        scanned
        ghosts={ghosts}
        primaryChannelKey={primaryChannelKey}
      />
    );
  }
  if (dims === "2D") {
    const xs = active.axisValues[0] || [];
    const ys = active.axisValues[1] || [];
    const metric = metric2D || Object.keys(active.channels)[0];
    const values = active.channelData[metric]?.values || [];
    return (
      <Plot2D
        xs={xs}
        ys={ys}
        values={values}
        xLabel={axisLabel(active.axes[0])}
        yLabel={axisLabel(active.axes[1])}
        metric={metric}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--p-ink50)",
        fontSize: 12,
      }}
    >
      Unsupported scan dimensionality: {dims}
    </div>
  );
}

PlotBody.propTypes = {
  active: PropTypes.object,
  dims: PropTypes.string,
  channelDescriptors: PropTypes.array.isRequired,
  renderGroups: PropTypes.array,
  primaryChannelKey: PropTypes.string,
  metric2D: PropTypes.string,
  ghosts: PropTypes.array,
  status: PropTypes.string,
  sseError: PropTypes.string,
  timeseries0D: PropTypes.object,
};

ActiveHeader.propTypes = {
  prefix: PropTypes.string,
  rid: PropTypes.number,
  fragmentFqn: PropTypes.string,
  dims: PropTypes.string,
};

export default PlotsApp;
