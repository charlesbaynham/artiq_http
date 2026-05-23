import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { niceTicks, formatNum, rampColor } from "./utils";

// 2D heatmap plot — single metric, colorbar, crosshair cursor.
//
// Real ARTIQ data arrives as flat arrays for (axis_0, axis_1, channel_value).
// We bin the points onto a regular grid (rendered as a canvas image), then
// draw axes/cursor in an overlay SVG.
function Plot2D({ xs, ys, values, xLabel, yLabel, metric }) {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 460 });
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      const cr = e.contentRect;
      setSize({
        w: Math.max(360, cr.width),
        h: Math.max(220, cr.height),
      });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  // Infer grid: take unique sorted axis values; if regular, use as grid;
  // otherwise fall back to scatter rendering.
  const { grid, cols, rows, xRange, yRange, vRange } = useMemo(() => {
    if (!xs.length || !ys.length || !values.length) {
      return {
        grid: null,
        cols: 0,
        rows: 0,
        xRange: [0, 1],
        yRange: [0, 1],
        vRange: [0, 1],
      };
    }
    const uniqX = [...new Set(xs)].sort((a, b) => a - b);
    const uniqY = [...new Set(ys)].sort((a, b) => a - b);
    const C = uniqX.length;
    const R = uniqY.length;
    const xIdx = new Map(uniqX.map((v, i) => [v, i]));
    const yIdx = new Map(uniqY.map((v, i) => [v, i]));
    const g = Array.from({ length: R }, () => new Array(C).fill(NaN));
    let vMin = Infinity,
      vMax = -Infinity;
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      if (!isFinite(v)) continue;
      const ci = xIdx.get(xs[i]);
      const ri = yIdx.get(ys[i]);
      if (ci == null || ri == null) continue;
      g[ri][ci] = v;
      if (v < vMin) vMin = v;
      if (v > vMax) vMax = v;
    }
    if (!isFinite(vMin) || !isFinite(vMax) || vMin === vMax) {
      vMin = 0;
      vMax = 1;
    }
    return {
      grid: g,
      cols: C,
      rows: R,
      xRange: [uniqX[0], uniqX[C - 1]],
      yRange: [uniqY[0], uniqY[R - 1]],
      vRange: [vMin, vMax],
    };
  }, [xs, ys, values]);

  const padL = 56,
    padR = 70,
    padT = 18,
    padB = 38;
  const innerW = size.w - padL - padR;
  const innerH = size.h - padT - padB;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !grid || cols === 0 || rows === 0) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.max(1, innerW) * dpr;
    cv.height = Math.max(1, innerH) * dpr;
    cv.style.width = innerW + "px";
    cv.style.height = innerH + "px";
    const ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const img = ctx.createImageData(cols, rows);
    const [vMin, vMax] = vRange;
    const span = vMax - vMin || 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = grid[r][c];
        const norm = isFinite(v) ? (v - vMin) / span : 0;
        const [R, G, B] = rampColor(norm);
        // Flip y so high values sit at top.
        const dr = rows - 1 - r;
        const p = (dr * cols + c) * 4;
        img.data[p] = R;
        img.data[p + 1] = G;
        img.data[p + 2] = B;
        img.data[p + 3] = isFinite(v) ? 255 : 0;
      }
    }
    const off = document.createElement("canvas");
    off.width = cols;
    off.height = rows;
    off.getContext("2d").putImageData(img, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(off, 0, 0, innerW * dpr, innerH * dpr);
  }, [grid, cols, rows, innerW, innerH, vRange]);

  if (!grid || cols === 0 || rows === 0) {
    return (
      <div
        ref={ref}
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
        Waiting for grid points…
      </div>
    );
  }

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const sx = (x) => padL + ((x - xMin) / (xMax - xMin || 1)) * innerW;
  const sy = (y) => padT + (1 - (y - yMin) / (yMax - yMin || 1)) * innerH;
  const xTicks = niceTicks(xMin, xMax, 6);
  const yTicks = niceTicks(yMin, yMax, 5);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (px < padL || px > padL + innerW || py < padT || py > padT + innerH) {
      setCursor(null);
      return;
    }
    const xVal = xMin + ((px - padL) / innerW) * (xMax - xMin);
    const yVal = yMin + (1 - (py - padT) / innerH) * (yMax - yMin);
    const c = Math.min(
      cols - 1,
      Math.max(0, Math.floor(((px - padL) / innerW) * cols)),
    );
    const r = Math.min(
      rows - 1,
      Math.max(0, Math.floor((1 - (py - padT) / innerH) * rows)),
    );
    setCursor({ x: xVal, y: yVal, value: grid[r][c] });
  };
  const handleLeave = () => setCursor(null);

  const cursorX = cursor ? sx(cursor.x) : null;
  const cursorY = cursor ? sy(cursor.y) : null;

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          left: padL,
          top: padT,
          pointerEvents: "none",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <svg
        width={size.w}
        height={size.h}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ position: "relative", cursor: "crosshair" }}
      >
        <g stroke="var(--p-ink70)" strokeWidth="1" fill="none">
          <line
            x1={padL}
            y1={padT + innerH}
            x2={padL + innerW}
            y2={padT + innerH}
          />
          <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} />
          <line
            x1={padL + innerW}
            y1={padT}
            x2={padL + innerW}
            y2={padT + innerH}
          />
          <line x1={padL} y1={padT} x2={padL + innerW} y2={padT} />
        </g>
        <g fontSize="10" fill="var(--p-ink70)" textAnchor="middle">
          {xTicks.map((x) => (
            <g key={x}>
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
            <g key={y}>
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

        {cursor && (
          <g stroke="var(--p-accent)" strokeWidth="1" strokeDasharray="3 3">
            <line x1={cursorX} x2={cursorX} y1={padT} y2={padT + innerH} />
            <line x1={padL} x2={padL + innerW} y1={cursorY} y2={cursorY} />
            <circle
              cx={cursorX}
              cy={cursorY}
              r="4"
              fill="none"
              strokeDasharray="0"
            />
          </g>
        )}

        {/* colorbar */}
        <g transform={`translate(${padL + innerW + 18}, ${padT})`}>
          <ColorbarSVG height={innerH} />
          <text x="34" y="6" fontSize="10" fill="var(--p-ink70)">
            {formatNum(vRange[1])}
          </text>
          <text x="34" y={innerH - 2} fontSize="10" fill="var(--p-ink70)">
            {formatNum(vRange[0])}
          </text>
          <text
            x="14"
            y={innerH / 2}
            fontSize="10"
            fill="var(--p-ink50)"
            textAnchor="middle"
            transform={`rotate(-90, 14, ${innerH / 2})`}
          >
            {metric}
          </text>
        </g>

        <text
          x={padL + innerW / 2}
          y={size.h - 8}
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
          {yLabel || "y"}
        </text>
      </svg>

      <div
        style={{
          position: "absolute",
          top: 12,
          right: 100,
          background: "color-mix(in oklab, var(--p-panel) 92%, transparent)",
          border: "1px solid var(--p-border)",
          borderRadius: 6,
          padding: "4px 8px",
          fontSize: 11,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          backdropFilter: "blur(4px)",
        }}
      >
        <span className="p-lbl" style={{ fontSize: 9 }}>
          metric
        </span>
        <span
          className="p-mono"
          style={{ color: "var(--p-accent)", fontWeight: 600 }}
        >
          {metric}
        </span>
      </div>

      <CursorReadout2D
        cursor={cursor}
        metric={metric}
        xLabel={xLabel}
        yLabel={yLabel}
      />
    </div>
  );
}

function CursorReadout2D({ cursor, metric, xLabel, yLabel }) {
  return (
    <div
      className="p-panel-soft"
      style={{
        position: "absolute",
        left: 8,
        right: 8,
        bottom: 8,
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
          <span className="p-mono" style={{ minWidth: 200 }}>
            {(xLabel || "x").split(" /")[0]} = {formatNum(cursor.x)} ·{" "}
            {(yLabel || "y").split(" /")[0]} = {formatNum(cursor.y)}
          </span>
          <span className="p-mono" style={{ color: "var(--p-accent)" }}>
            {metric} ={" "}
            <b>{isFinite(cursor.value) ? formatNum(cursor.value) : "—"}</b>
          </span>
        </>
      ) : (
        <span className="p-dim" style={{ fontSize: 11.5 }}>
          hover the heatmap to sample
        </span>
      )}
    </div>
  );
}

function ColorbarSVG({ height }) {
  const id = React.useId();
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgb(20,22,36)" />
          <stop offset="25%" stopColor="rgb(60,60,110)" />
          <stop offset="50%" stopColor="rgb(140,90,80)" />
          <stop offset="75%" stopColor="rgb(220,130,60)" />
          <stop offset="100%" stopColor="rgb(248,220,110)" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="22"
        height={height}
        fill={`url(#${id})`}
        stroke="var(--p-ink70)"
        strokeWidth="1"
      />
    </>
  );
}

Plot2D.propTypes = {
  xs: PropTypes.array.isRequired,
  ys: PropTypes.array.isRequired,
  values: PropTypes.array.isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  metric: PropTypes.string,
};

export default Plot2D;
