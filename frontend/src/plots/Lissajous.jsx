import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { niceTicks, formatNum } from "./utils";
import { useMeasuredSize } from "./useMeasuredSize";
import { fitEllipse } from "./lissajous";

const MARGIN = { top: 40, right: 76, bottom: 44, left: 64 };

// Scan position -> colour, so the direction of travel round the figure is legible.
const scanColor = (t) => `hsl(${215 - 185 * t}, 72%, 62%)`;

function padded(values) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo || Math.abs(hi) || 1) * 0.08;
  return [lo - pad, hi + pad];
}

// Forward-vs-backward excitation fraction, one point per scan value. Over a fringe the
// traps trace an ellipse whose opening gives the interferometer phase.
function Lissajous({ points, xLabel, yLabel, scanLabel }) {
  const [setRef, size] = useMeasuredSize();
  const fit = useMemo(() => fitEllipse(points), [points]);

  const geom = useMemo(() => {
    if (points.length === 0) return null;
    const shown = fit ? [...points, ...fit.outline] : points;
    return {
      xr: padded(shown.map((p) => p.x)),
      yr: padded(shown.map((p) => p.y)),
      sr: [points[0].s, points[points.length - 1].s],
    };
  }, [points, fit]);

  if (!geom) {
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
        Waiting for points…
      </div>
    );
  }

  const W = size.w;
  const H = size.h;
  const iw = W - MARGIN.left - MARGIN.right;
  const ih = H - MARGIN.top - MARGIN.bottom;
  const sx = (v) =>
    MARGIN.left + ((v - geom.xr[0]) / (geom.xr[1] - geom.xr[0])) * iw;
  const sy = (v) =>
    MARGIN.top + ih - ((v - geom.yr[0]) / (geom.yr[1] - geom.yr[0])) * ih;
  const frac = (s) =>
    geom.sr[1] === geom.sr[0]
      ? 0
      : (s - geom.sr[0]) / (geom.sr[1] - geom.sr[0]);
  const polyline = (pts) =>
    pts.map((p) => `${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");
  const xTicks = niceTicks(geom.xr[0], geom.xr[1], Math.max(3, iw / 90));
  const yTicks = niceTicks(geom.yr[0], geom.yr[1], Math.max(3, ih / 60));
  const barX = W - MARGIN.right + 22;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div ref={setRef} style={{ flex: 1, minHeight: 0 }}>
        <svg width={W} height={H} role="img" aria-label="Lissajous figure">
          <defs>
            <linearGradient id="lissajous-scan" x1="0" y1="1" x2="0" y2="0">
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <stop key={t} offset={t} stopColor={scanColor(t)} />
              ))}
            </linearGradient>
          </defs>
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line
                x1={sx(t)}
                x2={sx(t)}
                y1={MARGIN.top}
                y2={MARGIN.top + ih}
                stroke="var(--p-grid)"
              />
              <text
                x={sx(t)}
                y={MARGIN.top + ih + 16}
                fill="var(--p-ink50)"
                fontSize="10.5"
                textAnchor="middle"
                className="p-mono"
              >
                {formatNum(t)}
              </text>
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + iw}
                y1={sy(t)}
                y2={sy(t)}
                stroke="var(--p-grid)"
              />
              <text
                x={MARGIN.left - 8}
                y={sy(t) + 3.5}
                fill="var(--p-ink50)"
                fontSize="10.5"
                textAnchor="end"
                className="p-mono"
              >
                {formatNum(t)}
              </text>
            </g>
          ))}
          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--p-border-hi)"
          />
          <text
            x={MARGIN.left + iw / 2}
            y={H - 8}
            fill="var(--p-ink70)"
            fontSize="11.5"
            textAnchor="middle"
          >
            {xLabel}
          </text>
          <text
            transform={`translate(14 ${MARGIN.top + ih / 2}) rotate(-90)`}
            fill="var(--p-ink70)"
            fontSize="11.5"
            textAnchor="middle"
          >
            {yLabel}
          </text>

          {fit && (
            <>
              <polyline
                points={polyline(fit.outline)}
                fill="none"
                stroke="var(--p-ink50)"
                strokeWidth="1.3"
                strokeDasharray="5 4"
              />
              <path
                d={`M${sx(fit.centre.x) - 5},${sy(fit.centre.y)}h10M${sx(
                  fit.centre.x,
                )},${sy(fit.centre.y) - 5}v10`}
                stroke="var(--p-ink50)"
              />
            </>
          )}
          <polyline
            points={polyline(points)}
            fill="none"
            stroke="var(--p-ink30)"
            strokeWidth="1"
          />
          {points.map((p) => (
            <circle
              key={p.s}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r="3.2"
              fill={scanColor(frac(p.s))}
            >
              <title>{`${scanLabel} ${formatNum(p.s)}: (${formatNum(
                p.x,
              )}, ${formatNum(p.y)})`}</title>
            </circle>
          ))}

          <rect
            x={barX}
            y={MARGIN.top}
            width="10"
            height={ih}
            fill="url(#lissajous-scan)"
            rx="2"
          />
          <text
            x={barX + 14}
            y={MARGIN.top + 8}
            fill="var(--p-ink50)"
            fontSize="10"
            className="p-mono"
          >
            {formatNum(geom.sr[1])}
          </text>
          <text
            x={barX + 14}
            y={MARGIN.top + ih}
            fill="var(--p-ink50)"
            fontSize="10"
            className="p-mono"
          >
            {formatNum(geom.sr[0])}
          </text>
        </svg>
      </div>
      <div
        className="p-panel-soft p-mono"
        title={`colour = ${scanLabel}`}
        style={{
          margin: "0 8px 8px",
          padding: "4px 8px",
          fontSize: 11.5,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {fit ? (
          <>
            ellipse fit · |δ| = {fit.deltaDeg.toFixed(1)}° · centre (
            {formatNum(fit.centre.x)}, {formatNum(fit.centre.y)})
          </>
        ) : (
          <span className="p-dim">
            {points.length < 6 ? "need ≥ 6 points to fit" : "no ellipse fit"}
          </span>
        )}
        <span className="p-dim"> · colour = {scanLabel}</span>
      </div>
    </div>
  );
}

Lissajous.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      s: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ).isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  scanLabel: PropTypes.string,
};

export default Lissajous;
