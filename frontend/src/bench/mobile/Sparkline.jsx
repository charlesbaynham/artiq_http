/**
 * A small, dependency-free live-plot thumbnail (IMPL-SPEC §2b-1 / §2b-3).
 *
 * Reused at 130px thumbnail size on the mobile home screen and at full size
 * on the run-detail Plot tab. This is deliberately *not* a re-implementation
 * of `plots/Plot1D.jsx` — no per-x mean/SEM aggregation, no channel rail, no
 * zoom. It draws whatever `xValues`/`yValues` it is given with the same
 * visual treatment as the desktop plot: `--b-grid` gridlines, a 2px
 * `--b-accent` polyline, point markers, and a 1px dashed `--b-ok` vertical
 * cursor at the newest point.
 *
 * Points are connected in x-sorted order (so a real scan reads as a curve
 * rather than however the SSE stream happened to reveal them — the mock's
 * live 1D run streams in randomised order), but the "newest" marker/cursor
 * always tracks the most-recently-arrived point (the last array element),
 * which is not necessarily the rightmost one for a randomised scan.
 */

import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { channelPriority } from "../../plots/utils";

/**
 * Pick the "primary" channel key for a single-trace thumbnail: highest
 * ndscan `display_hints.priority`, ties broken by key order. A lightweight
 * cousin of `plots/utils.js`'s `defaultVisibleChannels` — the Sparkline only
 * ever draws one trace, so there is no need for the full visibility-set
 * logic.
 *
 * @param {object|null} channels - `{ key: {display_hints?: {priority}} }`
 * @returns {string|null}
 */
export function pickPrimaryChannel(channels) {
  const keys = Object.keys(channels || {});
  if (!keys.length) return null;
  return keys.reduce((best, k) =>
    channelPriority(channels[k]) > channelPriority(channels[best]) ? k : best,
  );
}

function extent(values) {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min === max) return [min - 1, max + 1];
  return [min, max];
}

function Sparkline({
  xValues = [],
  yValues = [],
  viewBoxWidth = 300,
  viewBoxHeight = 130,
  padding = 10,
  gridRows = 2,
  gridCols = 2,
  markerRadius = 2.5,
  newestMarkerRadius = 3.5,
  showMarkers = true,
  showCursor = true,
  className,
  title,
}) {
  const points = useMemo(() => {
    const n = Math.min(xValues.length, yValues.length);
    const out = [];
    for (let i = 0; i < n; i += 1) {
      const x = xValues[i];
      const y = yValues[i];
      if (Number.isFinite(x) && Number.isFinite(y)) out.push({ x, y, i });
    }
    return out;
  }, [xValues, yValues]);

  const W = viewBoxWidth;
  const H = viewBoxHeight;

  const gridLinesH = [];
  for (let i = 1; i < gridRows; i += 1) gridLinesH.push((H * i) / gridRows);
  const gridLinesV = [];
  for (let i = 1; i < gridCols; i += 1) gridLinesV.push((W * i) / gridCols);

  const grid = (
    <g stroke="var(--b-grid)" strokeWidth="1">
      {gridLinesH.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2={W} y2={y} />
      ))}
      {gridLinesV.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2={H} />
      ))}
    </g>
  );

  const svgClassName = ["bm-sparkline", className].filter(Boolean).join(" ");

  if (!points.length) {
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className={svgClassName}
        role="img"
        aria-label={title || "no data yet"}
      >
        {grid}
      </svg>
    );
  }

  const xExtent = extent(points.map((p) => p.x));
  const yExtent = extent(points.map((p) => p.y));

  if (!xExtent || !yExtent) {
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className={svgClassName}
        role="img"
        aria-label={title || "no data yet"}
      >
        {grid}
      </svg>
    );
  }

  const [xMin, xMax] = xExtent;
  const [yMin, yMax] = yExtent;

  const px = (x) => padding + ((x - xMin) / (xMax - xMin)) * (W - 2 * padding);
  const py = (y) =>
    H - padding - ((y - yMin) / (yMax - yMin)) * (H - 2 * padding);

  const sorted = [...points].sort((a, b) => a.x - b.x);
  const newest = points[points.length - 1];

  const polylinePoints = sorted
    .map((p) => `${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`)
    .join(" ");
  const newestPx = px(newest.x);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={svgClassName}
      role="img"
      aria-label={title || `live trace, ${points.length} points`}
    >
      {grid}
      <polyline
        fill="none"
        stroke="var(--b-accent)"
        strokeWidth="2"
        points={polylinePoints}
      />
      {showMarkers &&
        sorted.map((p) => (
          <circle
            key={p.i}
            cx={px(p.x)}
            cy={py(p.y)}
            r={p.i === newest.i ? newestMarkerRadius : markerRadius}
            fill="var(--b-accent)"
          />
        ))}
      {showCursor && (
        <line
          x1={newestPx}
          y1="0"
          x2={newestPx}
          y2={H}
          stroke="var(--b-ok)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      )}
    </svg>
  );
}

Sparkline.propTypes = {
  xValues: PropTypes.arrayOf(PropTypes.number),
  yValues: PropTypes.arrayOf(PropTypes.number),
  viewBoxWidth: PropTypes.number,
  viewBoxHeight: PropTypes.number,
  padding: PropTypes.number,
  gridRows: PropTypes.number,
  gridCols: PropTypes.number,
  markerRadius: PropTypes.number,
  newestMarkerRadius: PropTypes.number,
  showMarkers: PropTypes.bool,
  showCursor: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Sparkline;
