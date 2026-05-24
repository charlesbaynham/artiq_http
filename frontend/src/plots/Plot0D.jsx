import React from "react";
import PropTypes from "prop-types";

// 0D plot — one big-number tile per active channel. Real NDScan 0D scans
// publish a single value per channel under `<prefix>.point.<channel>`.
function Plot0D({ channels }) {
  const onChannels = channels.filter((c) => c.on);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 12,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {onChannels.length === 0 && (
          <div
            style={{
              padding: 16,
              fontSize: 12,
              color: "var(--p-ink50)",
              textAlign: "center",
            }}
          >
            No channels visible.
          </div>
        )}
        {onChannels.map((c) => (
          <div
            key={c.key}
            className="p-panel"
            style={{
              padding: "12px 14px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 3,
                  background: c.color,
                  borderRadius: 1,
                  flex: "0 0 auto",
                }}
              />
              <span
                className="p-mono"
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={c.key}
              >
                {c.key}
              </span>
            </div>
            <div
              className="p-mono p-tnum"
              style={{
                fontSize: 36,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: c.color,
              }}
            >
              {formatValue(c.value)}
            </div>
            {c.unit && (
              <div
                className="p-mono p-dim"
                style={{
                  fontSize: 10,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {c.unit}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatValue(v) {
  if (v === undefined || v === null) return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v !== "number") return String(v);
  if (!isFinite(v)) return "—";
  return v.toPrecision(5);
}

Plot0D.propTypes = {
  channels: PropTypes.array.isRequired,
};

export default Plot0D;
