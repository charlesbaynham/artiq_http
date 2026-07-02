import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { niceTicks, formatNum } from "./utils";
import { useMeasuredSize } from "./useMeasuredSize";

// Group (x, value) pairs by identical x, returning points sorted by x with the
// mean and standard error of the mean (std / sqrt(n)) of the values at each x.
// Scans are often run in a randomized order and/or with repeats, so connecting
// the raw points in arrival order produces a messy line; aggregating by x gives
// a line through the per-x mean (with `err` available for error bars).
function aggregateByX(xs, values) {
  const groups = new Map();
  const n = Math.min(xs.length, values.length);
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const v = values[i];
    if (!isFinite(x) || !isFinite(v)) continue;
    let g = groups.get(x);
    if (!g) groups.set(x, (g = []));
    g.push(v);
  }
  const pts = [];
  for (const [x, vs] of groups) {
    const m = vs.length;
    const mean = vs.reduce((a, b) => a + b, 0) / m;
    let err = 0;
    if (m > 1) {
      const variance =
        vs.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (m - 1);
      // Standard error of the mean: sample std divided by sqrt(n).
      err = Math.sqrt(variance / m);
    }
    pts.push({ x, mean, err, n: m });
  }
  pts.sort((a, b) => a.x - b.x);
  return pts;
}

// Build the ordered list of curve points used to draw the connecting line. For
// scanned axes we sort by x and collapse repeats to their mean ± standard error;
// for a time axis (e.g. 0D repeat mode) the arrival order is meaningful, so
// points are kept as-is with no aggregation.
function buildCurve(xs, values, scanned) {
  if (scanned) return aggregateByX(xs, values);
  const pts = [];
  const n = Math.min(xs.length, values.length);
  for (let i = 0; i < n; i++) {
    if (isFinite(xs[i]) && isFinite(values[i])) {
      pts.push({ x: xs[i], mean: values[i], err: 0, n: 1 });
    }
  }
  return pts;
}

// 1D plot — points + connecting line per channel, optional ghost overlays,
// crosshair cursor with per-channel readouts, inline legend. When `scanned` is
// true the x-axis is a real scanned parameter, so points are sorted by x and
// repeats at the same x are collapsed to their mean with standard-error bars;
// when false (e.g. a 0D elapsed-time series) points are connected in order.
function Plot1D({
  xs,
  xLabel,
  yLabel,
  channels,
  ghosts = [],
  scanned = false,
}) {
  const [setRef, size] = useMeasuredSize();
  const [cursor, setCursor] = useState(null);

  // Aggregate raw points into the curves used for the connecting lines and
  // error bars. Memoized so cursor moves (which only set local state) don't
  // recompute it — the props are stable between hovers.
  const { onChannels, channelCurves, ghostCurves } = useMemo(() => {
    const onCh = channels.filter((c) => c.on && c.values && c.values.length);
    return {
      onChannels: onCh,
      channelCurves: onCh.map((c) => ({
        ...c,
        curve: buildCurve(xs, c.values, scanned),
      })),
      ghostCurves: ghosts.map((g) => ({
        ...g,
        curve: buildCurve(
          g.xs && g.xs.length ? g.xs : xs,
          g.values || [],
          scanned,
        ),
      })),
    };
  }, [channels, xs, ghosts, scanned]);

  if (!xs.length || !onChannels.length) {
    return (
      <div
        ref={setRef}
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
        {xs.length === 0 ? "Waiting for points…" : "No channels visible."}
      </div>
    );
  }

  const padL = 56,
    padR = 18,
    padT = 18,
    padB = 44;
  const innerW = size.w - padL - padR;
  const innerH = size.h - padT - padB;

  // x range from axis values, including any ghost overlays so a wider ghost
  // isn't clipped (matching the y-range treatment below).
  const allXs = ghostCurves.reduce(
    (acc, g) => acc.concat(g.curve.map((p) => p.x)),
    xs.filter((x) => isFinite(x)),
  );
  const xMin = Math.min(...allXs);
  const xMax = Math.max(...allXs);
  // y range from all visible channels (with sensible fallback). Include the
  // raw points and the mean ± standard-error extents, since a large error bar
  // can push beyond the most extreme raw point.
  let yMin = Infinity,
    yMax = -Infinity;
  const extendY = (v) => {
    if (!isFinite(v)) return;
    if (v < yMin) yMin = v;
    if (v > yMax) yMax = v;
  };
  for (const c of onChannels) {
    for (const v of c.values) extendY(v);
  }
  for (const c of channelCurves) {
    for (const p of c.curve) {
      extendY(p.mean - p.err);
      extendY(p.mean + p.err);
    }
  }
  // Fold ghost overlays into the range too, so an overlaid run is never
  // clipped off-screen (e.g. early in a live scan when the active data still
  // spans a tiny range).
  for (const g of ghostCurves) {
    for (const v of g.values || []) extendY(v);
    for (const p of g.curve) {
      extendY(p.mean - p.err);
      extendY(p.mean + p.err);
    }
  }
  if (!isFinite(yMin) || !isFinite(yMax) || yMin === yMax) {
    yMin = 0;
    yMax = 1;
  } else {
    const pad = (yMax - yMin) * 0.08;
    yMin -= pad;
    yMax += pad;
  }

  const sx = (x) => padL + ((x - xMin) / (xMax - xMin || 1)) * innerW;
  const sy = (y) => padT + (1 - (y - yMin) / (yMax - yMin || 1)) * innerH;

  const xTicks = niceTicks(xMin, xMax, 6);
  const yTicks = niceTicks(yMin, yMax, 5);

  // Place the cursor from a client-x coordinate (shared by mouse + touch).
  const setCursorFromClientX = (clientX, rect) => {
    const px = clientX - rect.left;
    if (px < padL || px > padL + innerW) {
      setCursor(null);
      return;
    }
    const xVal = xMin + ((px - padL) / innerW) * (xMax - xMin);
    setCursor({ x: xVal, px });
  };
  const handleMove = (e) =>
    setCursorFromClientX(e.clientX, e.currentTarget.getBoundingClientRect());
  const handleLeave = () => setCursor(null);
  // Touch devices can't hover, so tapping / dragging along the plot scrubs the
  // cursor readout instead. We don't preventDefault so vertical page scrolling
  // still works when the gesture is a scroll rather than a scrub.
  const handleTouch = (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    setCursorFromClientX(t.clientX, e.currentTarget.getBoundingClientRect());
  };

  // Report the curve point (mean, sorted by x) nearest the cursor's x. Using
  // the curve rather than the raw array index keeps the readout correct even
  // when points were sampled out of order.
  const nearestPoint = (curve) => {
    if (!curve.length) return null;
    let best = curve[0];
    let bestD = Math.abs(curve[0].x - cursor.x);
    for (const p of curve) {
      const d = Math.abs(p.x - cursor.x);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  };

  const cursorX = cursor ? sx(cursor.x) : null;
  const cursorReadouts = cursor
    ? channelCurves.map((c) => {
        const p = nearestPoint(c.curve);
        return {
          key: c.key,
          color: c.color,
          value: p ? p.mean : NaN,
          err: p && scanned && p.n > 1 ? p.err : null,
        };
      })
    : [];
  const cursorGhostReadouts = cursor
    ? ghostCurves.flatMap((g) => {
        const p = nearestPoint(g.curve);
        if (!p) return [];
        return [{ rid: g.rid, value: p.mean }];
      })
    : [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={setRef}
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <svg
          width={size.w}
          height={size.h}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            cursor: "crosshair",
            touchAction: "pan-y",
          }}
        >
          {/* grid */}
          <g>
            {yTicks.map((y) => (
              <line
                key={"gy" + y}
                x1={padL}
                x2={padL + innerW}
                y1={sy(y)}
                y2={sy(y)}
                stroke="var(--p-grid)"
                strokeWidth="1"
              />
            ))}
            {xTicks.map((x) => (
              <line
                key={"gx" + x}
                x1={sx(x)}
                x2={sx(x)}
                y1={padT}
                y2={padT + innerH}
                stroke="var(--p-grid)"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* axes */}
          <g stroke="var(--p-ink70)" strokeWidth="1">
            <line
              x1={padL}
              y1={padT + innerH}
              x2={padL + innerW}
              y2={padT + innerH}
            />
            <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} />
          </g>
          <g fontSize="10" fill="var(--p-ink70)" textAnchor="middle">
            {xTicks.map((x) => (
              <g key={"tx" + x}>
                <line
                  x1={sx(x)}
                  x2={sx(x)}
                  y1={padT + innerH}
                  y2={padT + innerH + 4}
                  stroke="var(--p-ink70)"
                  strokeWidth="1"
                />
                <text x={sx(x)} y={padT + innerH + 16}>
                  {formatNum(x)}
                </text>
              </g>
            ))}
          </g>
          <g fontSize="10" fill="var(--p-ink70)" textAnchor="end">
            {yTicks.map((y) => (
              <g key={"ty" + y}>
                <line
                  x1={padL - 4}
                  x2={padL}
                  y1={sy(y)}
                  y2={sy(y)}
                  stroke="var(--p-ink70)"
                  strokeWidth="1"
                />
                <text x={padL - 8} y={sy(y) + 3}>
                  {formatNum(y)}
                </text>
              </g>
            ))}
          </g>

          {/* ghost traces — faded dashed line through the per-x means, with
              faint raw points so the underlying scatter is still visible. */}
          {ghostCurves.map((g, gi) => {
            const arr = g.values || [];
            const gxs = g.xs && g.xs.length ? g.xs : xs;
            const line = g.curve
              .map((p) => `${sx(p.x)},${sy(p.mean)}`)
              .join(" ");
            return (
              <g key={"gh" + gi}>
                {arr.map((v, i) =>
                  isFinite(v) && isFinite(gxs[i]) ? (
                    <circle
                      key={i}
                      cx={sx(gxs[i])}
                      cy={sy(v)}
                      r="1.5"
                      fill="var(--p-ink50)"
                      opacity="0.4"
                    />
                  ) : null,
                )}
                {g.curve.length > 1 && (
                  <polyline
                    points={line}
                    fill="none"
                    stroke="var(--p-ink50)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    opacity="0.6"
                  />
                )}
              </g>
            );
          })}

          {/* active channel traces — connecting line through the per-x means,
              raw points, and standard-error bars where there are repeats. */}
          {channelCurves.map((c) => {
            const pts = c.curve;
            const hasRepeats = scanned && pts.some((p) => p.n > 1);
            const line = pts.map((p) => `${sx(p.x)},${sy(p.mean)}`).join(" ");
            return (
              <g key={c.key}>
                {pts.length > 1 && (
                  <polyline
                    points={line}
                    fill="none"
                    stroke={c.color}
                    strokeWidth="1.6"
                    opacity="0.85"
                  />
                )}
                {/* raw individual points — dimmed when repeats are summarized
                    by mean markers, otherwise shown at full prominence. */}
                {c.values.map((v, i) =>
                  isFinite(v) && isFinite(xs[i]) ? (
                    <circle
                      key={i}
                      cx={sx(xs[i])}
                      cy={sy(v)}
                      r={hasRepeats ? "1.6" : "2"}
                      fill={c.color}
                      opacity={hasRepeats ? 0.4 : 1}
                    />
                  ) : null,
                )}
                {/* error bars + mean markers (only when repeats exist) */}
                {hasRepeats &&
                  pts.map((p, i) => (
                    <g key={"eb" + i}>
                      {p.err > 0 && (
                        <g stroke={c.color} strokeWidth="1" opacity="0.75">
                          <line
                            x1={sx(p.x)}
                            x2={sx(p.x)}
                            y1={sy(p.mean - p.err)}
                            y2={sy(p.mean + p.err)}
                          />
                          <line
                            x1={sx(p.x) - 3}
                            x2={sx(p.x) + 3}
                            y1={sy(p.mean - p.err)}
                            y2={sy(p.mean - p.err)}
                          />
                          <line
                            x1={sx(p.x) - 3}
                            x2={sx(p.x) + 3}
                            y1={sy(p.mean + p.err)}
                            y2={sy(p.mean + p.err)}
                          />
                        </g>
                      )}
                      <circle
                        cx={sx(p.x)}
                        cy={sy(p.mean)}
                        r="2.6"
                        fill={c.color}
                      />
                    </g>
                  ))}
              </g>
            );
          })}

          {/* cursor */}
          {cursorX != null && (
            <line
              x1={cursorX}
              x2={cursorX}
              y1={padT}
              y2={padT + innerH}
              stroke="var(--p-accent)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* axis labels */}
          <text
            x={padL + innerW / 2}
            y={padT + innerH + 30}
            textAnchor="middle"
            fontSize="11"
            fill="var(--p-ink70)"
            fontFamily="var(--p-font-mono)"
          >
            {xLabel || "x"}
          </text>
          <text
            x={14}
            y={padT + innerH / 2}
            textAnchor="middle"
            fontSize="11"
            fill="var(--p-ink70)"
            fontFamily="var(--p-font-mono)"
            transform={`rotate(-90, 14, ${padT + innerH / 2})`}
          >
            {yLabel || "value"}
          </text>
        </svg>

        {/* legend */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 56,
            background: "color-mix(in oklab, var(--p-panel) 92%, transparent)",
            border: "1px solid var(--p-border)",
            borderRadius: 6,
            padding: "6px 8px",
            fontSize: 11,
            lineHeight: 1.5,
            minWidth: 160,
            backdropFilter: "blur(4px)",
            maxWidth: 220,
          }}
        >
          {onChannels.map((c) => (
            <div
              key={c.key}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span
                style={{
                  width: 18,
                  height: 2,
                  background: c.color,
                  borderRadius: 1,
                  flex: "0 0 auto",
                }}
              />
              <span
                className="p-mono"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={c.key}
              >
                {c.key}
              </span>
            </div>
          ))}
          {ghosts.map((g) => (
            <div
              key={g.rid + "-ghost"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                opacity: 0.7,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 0,
                  borderTop: "1.5px dashed var(--p-ink50)",
                }}
              />
              <span className="p-mono p-dim">ghost</span>
              <span className="p-dim" style={{ marginLeft: "auto" }}>
                #{g.rid}
              </span>
            </div>
          ))}
        </div>
      </div>
      <CursorReadout
        cursor={cursor}
        xLabel={xLabel}
        cursorReadouts={cursorReadouts}
        ghostReadouts={cursorGhostReadouts}
      />
    </div>
  );
}

function CursorReadout({ cursor, xLabel, cursorReadouts, ghostReadouts }) {
  return (
    <div
      className="p-panel-soft p-cursor-readout"
      style={{
        flex: "0 0 auto",
        margin: "0 8px 8px",
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 11.5,
        minHeight: 28,
      }}
    >
      <span className="p-lbl" style={{ minWidth: 50 }}>
        CURSOR
      </span>
      {cursor ? (
        <>
          <span className="p-mono" style={{ minWidth: 110 }}>
            {(xLabel || "x").split(" /")[0]} = {formatNum(cursor.x)}
          </span>
          <div className="p-cursor-values">
            {cursorReadouts.map((r) => (
              <span key={r.key} className="p-mono" style={{ color: r.color }}>
                {r.key} = <b>{formatNum(r.value)}</b>
                {r.err != null && r.err > 0 ? ` ± ${formatNum(r.err)}` : ""}
              </span>
            ))}
            {ghostReadouts.map((g) => (
              <span key={g.rid} className="p-mono p-dim">
                #{g.rid} = {formatNum(g.value)}
              </span>
            ))}
          </div>
        </>
      ) : (
        <span className="p-dim" style={{ fontSize: 11.5 }}>
          hover or tap the plot to read values
        </span>
      )}
    </div>
  );
}

Plot1D.propTypes = {
  xs: PropTypes.array.isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  channels: PropTypes.array.isRequired,
  ghosts: PropTypes.array,
  scanned: PropTypes.bool,
};

export default Plot1D;
