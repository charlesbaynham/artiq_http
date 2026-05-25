import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { niceTicks, formatNum } from "./utils";

// 1D plot — points + connecting line per channel, optional ghost overlays,
// crosshair cursor with per-channel readouts, inline legend.
function Plot1D({ xs, xLabel, yLabel, channels, ghosts = [] }) {
  const ref = useRef(null);
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

  const onChannels = channels.filter(
    (c) => c.on && c.values && c.values.length,
  );

  if (!xs.length || !onChannels.length) {
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

  // x range from axis values
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  // y range from all visible channels (with sensible fallback)
  let yMin = Infinity,
    yMax = -Infinity;
  for (const c of onChannels) {
    for (const v of c.values) {
      if (!isFinite(v)) continue;
      if (v < yMin) yMin = v;
      if (v > yMax) yMax = v;
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

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    if (px < padL || px > padL + innerW) {
      setCursor(null);
      return;
    }
    const xVal = xMin + ((px - padL) / innerW) * (xMax - xMin);
    setCursor({ x: xVal, px });
  };
  const handleLeave = () => setCursor(null);

  const cursorX = cursor ? sx(cursor.x) : null;
  const cursorReadouts = cursor
    ? onChannels.map((c) => {
        const arr = c.values;
        let idx = Math.round(
          ((cursor.x - xMin) / (xMax - xMin || 1)) * (arr.length - 1),
        );
        idx = Math.max(0, Math.min(arr.length - 1, idx));
        return { key: c.key, color: c.color, value: arr[idx] };
      })
    : [];
  const cursorGhostReadouts = cursor
    ? ghosts.flatMap((g) => {
        const arr = g.values;
        if (!arr || !arr.length) return [];
        let idx = Math.round(
          ((cursor.x - xMin) / (xMax - xMin || 1)) * (arr.length - 1),
        );
        idx = Math.max(0, Math.min(arr.length - 1, idx));
        return [{ rid: g.rid, value: arr[idx] }];
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
        ref={ref}
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
          style={{ position: "absolute", top: 0, left: 0, cursor: "crosshair" }}
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

          {/* ghost traces */}
          {ghosts.map((g, gi) => {
            const arr = g.values || [];
            if (!arr.length) return null;
            // Ghost xs may differ; here we assume they share the same axis grid.
            const gxs = g.xs || xs;
            const pts = arr
              .map((v, i) => {
                const xv = gxs[i];
                if (!isFinite(v) || !isFinite(xv)) return null;
                return `${sx(xv)},${sy(v)}`;
              })
              .filter(Boolean)
              .join(" ");
            return (
              <polyline
                key={"gh" + gi}
                points={pts}
                fill="none"
                stroke="var(--p-ink50)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.55"
              />
            );
          })}

          {/* active channel traces */}
          {onChannels.map((c) => {
            const arr = c.values;
            const pts = arr
              .map((v, i) => {
                const xv = xs[i];
                if (!isFinite(v) || !isFinite(xv)) return null;
                return `${sx(xv)},${sy(v)}`;
              })
              .filter(Boolean)
              .join(" ");
            return (
              <g key={c.key}>
                <polyline
                  points={pts}
                  fill="none"
                  stroke={c.color}
                  strokeWidth="1.6"
                  opacity="0.85"
                />
                {arr.map((v, i) =>
                  isFinite(v) && isFinite(xs[i]) ? (
                    <circle
                      key={i}
                      cx={sx(xs[i])}
                      cy={sy(v)}
                      r="2"
                      fill={c.color}
                    />
                  ) : null,
                )}
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
          hover the plot to read values
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
};

export default Plot1D;
