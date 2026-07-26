/**
 * 2b-3 — Run detail (IMPL-SPEC §2b-3).
 *
 * Plot / Parameters / Logs tabs over one schedule item + its live dataset
 * stream. Reuses `Sparkline` at full size for the Plot tab, the same
 * `submit/params.js` param model as the desktop for Parameters descriptions,
 * and `plots/copyPlot.js` for the copy action (see `handleCopy` for how it
 * is driven off this component's own SVG rather than the desktop's).
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import {
  get_explist_arginfo,
  get_logs,
  queue_experiment,
} from "../../api/client";
import { copyPlotToClipboard } from "../../plots/copyPlot";
import useLiveRun, { formatDuration } from "../state/useLiveRun";
import { buildParamModel } from "../submit/params";
import { Pill, Mono, BenchButton } from "../ui/primitives";
import Sparkline, { pickPrimaryChannel } from "./Sparkline";

const TABS = ["Plot", "Parameters", "Logs"];

function axisSummary(axis) {
  const r = axis?.range || {};
  if (axis?.type === "list" || Array.isArray(r.values)) {
    return `list[${(r.values || []).length}]`;
  }
  if (axis?.type === "centre_span") {
    return `${r.centre} ± ${r.half_span} · ${r.num_points} pts`;
  }
  return `${r.start} → ${r.stop} · ${r.num_points} pts`;
}

function overrideValueText(value) {
  if (Array.isArray(value) && value.length && typeof value[0] === "object") {
    return JSON.stringify(value[0].value);
  }
  return JSON.stringify(value);
}

function RunDetail({ rid, items = [], cancel, onBack }) {
  const [tab, setTab] = useState("Plot");
  const navigate = useNavigate();
  const plotWrapRef = useRef(null);
  // "Already fired" guards for the two async tabs below — see the comment on
  // the Parameters effect for why this, rather than a status-in-deps effect,
  // is needed against `useSchedule`'s 1s polling.
  const fetchedParamsRef = useRef(null);
  const fetchedLogsRef = useRef(null);

  const scheduleItem = useMemo(
    () => items.find((i) => Number(i.rid) === Number(rid)) || null,
    [items, rid],
  );
  const liveRun = useLiveRun({ rid, scheduleItems: items });
  const isLive = liveRun.status === "running" || liveRun.status === "analyzing";
  const className = scheduleItem?.expid?.class_name || "";

  const primaryChannel = pickPrimaryChannel(liveRun.channels);
  const xValues = liveRun.plot?.axisValues?.[0] || [];
  const yValues = primaryChannel
    ? liveRun.plot?.channelData?.[primaryChannel]?.values || []
    : [];
  const axisParam = liveRun.plot?.axes?.[0]?.param;
  const axisLabel = axisParam
    ? `${axisParam.fqn}${axisParam.unit ? ` · ${axisParam.unit}` : ""}`
    : null;
  const totalChannels = liveRun.channels
    ? Object.keys(liveRun.channels).length
    : 0;

  /* ── Cancel / Repeat ───────────────────────────────────────────────── */

  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const handleCancel = useCallback(async () => {
    if (!scheduleItem) return;
    const running =
      scheduleItem.status === "running" || scheduleItem.status === "analyzing";
    if (running && !window.confirm(`Cancel the running RID ${rid}?`)) return;
    setBusy(true);
    setActionMessage(null);
    try {
      await cancel(rid);
      onBack();
    } catch (err) {
      setActionMessage(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  }, [scheduleItem, rid, cancel, onBack]);

  const handleRepeat = useCallback(async () => {
    if (!scheduleItem?.expid) return;
    setBusy(true);
    setActionMessage(null);
    try {
      const {
        file,
        class_name,
        repo_rev,
        arguments: args,
      } = scheduleItem.expid;
      const newRid = await queue_experiment(
        file,
        class_name,
        repo_rev,
        args || {},
        scheduleItem.pipeline || "main",
        scheduleItem.priority || 0,
      );
      setActionMessage(`Submitted RID ${newRid}`);
    } catch (err) {
      setActionMessage(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  }, [scheduleItem]);

  /* ── Plot actions ──────────────────────────────────────────────────── */

  const handleFullscreen = useCallback(() => {
    if (!liveRun.prefix) return;
    navigate(`/plots/fullscreen?scan=${encodeURIComponent(liveRun.prefix)}`);
  }, [liveRun.prefix, navigate]);

  const [copyStatus, setCopyStatus] = useState(null);

  const handleCopy = useCallback(async () => {
    setCopyStatus(null);
    const permalink = `${
      window.location.origin
    }/plots/fullscreen?scan=${encodeURIComponent(liveRun.prefix || "")}`;
    try {
      if (!plotWrapRef.current || !xValues.length) {
        throw new Error("nothing to rasterise yet");
      }
      // Driven directly off the Sparkline's own <svg> — copyPlotToClipboard
      // only needs a container with one <svg> in it plus a few descriptive
      // fields, all of which this component already has.
      await copyPlotToClipboard({
        containerEl: plotWrapRef.current,
        rid,
        dims: "1D",
        channelDescriptors: primaryChannel
          ? [{ key: primaryChannel, color: "#f08a4d", on: true }]
          : [],
        fragmentFqn: liveRun.plot?.fragmentFqn || className,
        ghosts: [],
      });
      setCopyStatus("Copied plot image");
    } catch {
      try {
        await navigator.clipboard.writeText(permalink);
        setCopyStatus("Copied permalink");
      } catch {
        setCopyStatus("Copy failed");
      }
    }
  }, [
    liveRun.prefix,
    liveRun.plot,
    primaryChannel,
    rid,
    className,
    xValues.length,
  ]);

  /* ── Parameters tab ────────────────────────────────────────────────── */

  const [paramInfo, setParamInfo] = useState({ status: "idle", params: [] });
  const expFile = scheduleItem?.expid?.file;
  const expClassName = scheduleItem?.expid?.class_name;

  useEffect(() => {
    if (tab !== "Parameters" || !expFile) return undefined;
    // Deliberately *not* keyed on `paramInfo.status`: `useSchedule` hands us
    // a new `items` array (and so a new `scheduleItem`/`expFile` identity)
    // every poll, so a status-in-deps effect would see its own `"loading"`
    // update as a fresh trigger, cancel the in-flight fetch on the resulting
    // re-run, and never actually land a result. A ref-backed "already fired
    // for this run" guard sidesteps that self-cancelling loop.
    if (fetchedParamsRef.current === expFile + "|" + expClassName)
      return undefined;
    fetchedParamsRef.current = expFile + "|" + expClassName;
    let cancelled = false;
    setParamInfo({ status: "loading", params: [] });
    get_explist_arginfo(expFile, expClassName)
      .then((res) => {
        if (cancelled) return;
        setParamInfo({
          status: "ready",
          params: buildParamModel(res?.arginfo),
        });
      })
      .catch(() => {
        if (!cancelled) setParamInfo({ status: "error", params: [] });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, expFile, expClassName]);

  const descByFqn = useMemo(() => {
    const map = new Map();
    for (const p of paramInfo.params) map.set(p.fqn, p.description);
    return map;
  }, [paramInfo.params]);

  const parametersView = useMemo(() => {
    const args = scheduleItem?.expid?.arguments || {};
    if (args.ndscan_params) {
      let parsed = null;
      try {
        parsed = JSON.parse(args.ndscan_params);
      } catch {
        parsed = null;
      }
      return {
        axes: parsed?.scan?.axes || [],
        overrides: parsed?.overrides || {},
        plain: null,
      };
    }
    return { axes: [], overrides: {}, plain: args };
  }, [scheduleItem]);

  /* ── Logs tab ──────────────────────────────────────────────────────── */

  const [logsState, setLogsState] = useState({ status: "idle", lines: [] });

  useEffect(() => {
    if (tab !== "Logs") return undefined;
    // See the Parameters effect above for why this guard is a ref rather
    // than `logsState.status` in the dependency array.
    if (fetchedLogsRef.current === rid) return undefined;
    fetchedLogsRef.current = rid;
    let cancelled = false;
    setLogsState({ status: "loading", lines: [] });
    get_logs()
      .then((res) => {
        if (cancelled) return;
        const all = res?.logs || [];
        const needle = String(rid);
        const attributionRe = new RegExp(`\\brid\\D{0,4}${needle}\\b`, "i");
        const mine = all.filter((l) => {
          const msg = String(l.message || "");
          const src = String(l.source || "");
          return attributionRe.test(msg) || src.includes(needle);
        });
        setLogsState({ status: "ready", lines: mine });
      })
      .catch(() => {
        if (!cancelled) setLogsState({ status: "error", lines: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [tab, rid]);

  return (
    <div className="bm-detail">
      <div className="bm-topbar">
        <button
          type="button"
          className="bm-back"
          onClick={onBack}
          aria-label="Back"
        >
          ‹
        </button>
        <Mono className="bm-detail__title b-ellipsis">
          RID {rid} · {className}
        </Mono>
        {isLive && <Pill status>● live</Pill>}
      </div>

      <div className="bm-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`bm-tab${tab === t ? " is-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bm-content b-scroll">
        {tab === "Plot" && (
          <>
            <div className="bm-plot-card bm-plot-card--full" ref={plotWrapRef}>
              <Sparkline
                xValues={xValues}
                yValues={yValues}
                viewBoxHeight={300}
                gridRows={3}
                gridCols={2}
                markerRadius={3}
                newestMarkerRadius={4}
              />
              {axisLabel && (
                <div className="bm-plot-axislabel b-mono b-muted">
                  {axisLabel}
                </div>
              )}
            </div>
            <div className="bm-pill-row">
              <Pill>
                channels {primaryChannel ? 1 : 0}/{totalChannels}
              </Pill>
              <Pill onClick={handleFullscreen}>⤢ fullscreen</Pill>
              <Pill onClick={handleCopy}>⧉ copy</Pill>
            </div>
            {copyStatus && <div className="bm-hint b-muted">{copyStatus}</div>}
          </>
        )}

        {tab === "Parameters" && (
          <div className="bm-params">
            {parametersView.plain ? (
              Object.entries(parametersView.plain).map(([fqn, value]) => (
                <div key={fqn} className="bm-param-row">
                  <div className="bm-param-row__head">
                    <Mono className="bm-param-row__fqn">{fqn}</Mono>
                    <Mono className="bm-param-row__value">
                      {JSON.stringify(value)}
                    </Mono>
                  </div>
                  {descByFqn.get(fqn) && (
                    <div className="bm-param-row__desc">
                      {descByFqn.get(fqn)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                {parametersView.axes.map((axis) => (
                  <div key={axis.fqn} className="bm-param-row">
                    <div className="bm-param-row__head">
                      <Mono className="bm-param-row__fqn">{axis.fqn}</Mono>
                      <Mono className="bm-param-row__value">
                        {axisSummary(axis)}
                      </Mono>
                    </div>
                    {descByFqn.get(axis.fqn) && (
                      <div className="bm-param-row__desc">
                        {descByFqn.get(axis.fqn)}
                      </div>
                    )}
                  </div>
                ))}
                {Object.entries(parametersView.overrides).map(
                  ([fqn, value]) => (
                    <div key={fqn} className="bm-param-row">
                      <div className="bm-param-row__head">
                        <Mono className="bm-param-row__fqn">{fqn}</Mono>
                        <Mono className="bm-param-row__value">
                          {overrideValueText(value)}
                        </Mono>
                      </div>
                      {descByFqn.get(fqn) && (
                        <div className="bm-param-row__desc">
                          {descByFqn.get(fqn)}
                        </div>
                      )}
                    </div>
                  ),
                )}
                {!parametersView.axes.length &&
                  !Object.keys(parametersView.overrides).length && (
                    <div className="bm-hint b-muted">
                      No overrides — running with default arguments.
                    </div>
                  )}
              </>
            )}
          </div>
        )}

        {tab === "Logs" && (
          <div className="bm-logs">
            {logsState.status === "loading" && (
              <div className="bm-hint b-muted">Loading…</div>
            )}
            {logsState.status === "ready" && logsState.lines.length === 0 && (
              <div className="bm-hint b-muted">no log lines for this run</div>
            )}
            {logsState.lines.map((l, i) => (
              <div key={i} className="bm-log-row">
                <Mono className="bm-log-row__meta b-faint">{l.source}</Mono>
                <div className="bm-log-row__msg">{l.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bm-detail__footer">
        {actionMessage && (
          <div className="bm-hint b-mono b-muted">{actionMessage}</div>
        )}
        <div className="bm-footer-buttons">
          <BenchButton
            variant="danger"
            size="md"
            onClick={handleCancel}
            disabled={busy || !scheduleItem}
          >
            Cancel
          </BenchButton>
          <BenchButton
            variant="primary"
            size="md"
            style={{ fontWeight: 600 }}
            onClick={handleRepeat}
            disabled={busy || !scheduleItem}
          >
            Repeat
          </BenchButton>
        </div>
      </div>
    </div>
  );
}

RunDetail.propTypes = {
  rid: PropTypes.number.isRequired,
  items: PropTypes.array,
  cancel: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default RunDetail;
