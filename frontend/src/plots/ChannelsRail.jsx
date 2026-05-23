import React, { useState } from "react";
import PropTypes from "prop-types";

function ChannelRow({ c, isRadio, onClick }) {
  return (
    <div
      className={"p-row" + (c.on ? " on" : "")}
      onClick={onClick}
      style={{ alignItems: "stretch", padding: "6px 6px", cursor: "pointer" }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          marginTop: 1,
          borderRadius: isRadio ? "50%" : 2,
          border: "1.5px solid " + (c.on ? c.color : "var(--p-ink30)"),
          background: c.on ? c.color : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        {c.on && !isRadio && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {c.on && isRadio && (
          <span
            style={{
              width: 5,
              height: 5,
              background: "#fff",
              borderRadius: "50%",
            }}
          />
        )}
      </div>
      <div style={{ width: 22, display: "flex", alignItems: "center" }}>
        {c.on && (
          <span
            style={{
              width: 22,
              height: 2,
              background: c.color,
              borderRadius: 1,
            }}
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        <span
          className="p-mono p-row-name"
          style={{
            fontSize: 12,
            color: c.on ? "var(--p-ink)" : "var(--p-ink70)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={c.key}
        >
          {c.key}
        </span>
        {c.unit && (
          <span className="p-dim p-mono" style={{ fontSize: 10 }}>
            {c.unit}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: c.on ? "var(--p-ink70)" : "var(--p-ink30)",
        }}
      >
        {c.on ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
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
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </div>
    </div>
  );
}

function ChannelsRail({
  mode,
  channels,
  onToggle,
  onPickMetric,
  experiment,
  saved = true,
}) {
  const isRadio = mode === "2D";
  const onCount = channels.filter((c) => c.on).length;
  const [filter, setFilter] = useState("");

  const visible = filter.trim()
    ? channels.filter((c) =>
        c.key.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : channels;

  return (
    <div
      className="p-panel p-rail-channels"
      style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <div className="p-panel-h">
        <span className="p-lbl">{isRadio ? "metric" : "channels"}</span>
        <span className="p-mono p-dim" style={{ fontSize: 11 }}>
          · {isRadio ? "1" : onCount} / {channels.length}
        </span>
      </div>
      <div
        style={{
          padding: "6px 10px 4px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {saved && experiment && (
          <span
            className="p-pill"
            style={{
              fontSize: 10,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={`Channel visibility persisted for ${experiment}`}
          >
            <span style={{ marginRight: 2 }}>💾</span> saved for{" "}
            <span
              className="p-mono"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 130,
              }}
            >
              {experiment}
            </span>
          </span>
        )}
        <input
          className="p-search p-mono"
          placeholder="filter channels…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="p-scroll" style={{ flex: 1, padding: "2px 6px 6px" }}>
        {visible.length === 0 && (
          <div
            style={{
              padding: 16,
              fontSize: 12,
              color: "var(--p-ink50)",
              textAlign: "center",
            }}
          >
            no channels
          </div>
        )}
        {visible.map((c) => (
          <ChannelRow
            key={c.key}
            c={c}
            isRadio={isRadio}
            onClick={() =>
              isRadio ? onPickMetric && onPickMetric(c.key) : onToggle(c.key)
            }
          />
        ))}
      </div>
      {isRadio && (
        <div
          style={{
            padding: "8px 10px",
            borderTop: "1px solid var(--p-border)",
            fontSize: 11,
            color: "var(--p-ink50)",
          }}
        >
          2D heatmap shows one metric. Pick another to swap.
        </div>
      )}
    </div>
  );
}

ChannelsRail.propTypes = {
  mode: PropTypes.oneOf(["0D", "1D", "2D"]).isRequired,
  channels: PropTypes.array.isRequired,
  onToggle: PropTypes.func,
  onPickMetric: PropTypes.func,
  experiment: PropTypes.string,
  saved: PropTypes.bool,
};

export default ChannelsRail;
