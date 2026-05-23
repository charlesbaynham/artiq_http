import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

function TimelineRow({ r, isActive, isGhost, canOverlay, onClick }) {
  const bg = isActive
    ? "color-mix(in oklab, var(--p-accent) 10%, transparent)"
    : isGhost
      ? "color-mix(in oklab, var(--p-ink) 4%, transparent)"
      : "transparent";
  const borderL = isActive
    ? "3px solid var(--p-accent)"
    : isGhost
      ? "3px dashed var(--p-ink50)"
      : "3px solid transparent";
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "14px 1fr auto",
        gap: 8,
        alignItems: "center",
        padding: "6px 8px",
        background: bg,
        borderLeft: borderL,
        borderRadius: 4,
        cursor: isActive || !canOverlay ? "default" : "pointer",
        opacity: !canOverlay && !isActive ? 0.65 : 1,
        marginBottom: 1,
      }}
    >
      <div
        style={{
          color: isActive
            ? "var(--p-accent)"
            : isGhost
              ? "var(--p-ink70)"
              : "var(--p-ink30)",
          fontSize: 13,
        }}
      >
        {isActive ? "▶" : isGhost ? "◉" : "◯"}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          gap: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            className="p-mono"
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: isActive ? "var(--p-accent)" : "var(--p-ink)",
            }}
          >
            {r.rid != null ? `#${r.rid}` : r.prefix}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className="p-dim p-mono"
            style={{
              fontSize: 9.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={r.prefix}
          >
            {r.prefix}
          </span>
        </div>
      </div>
      <div
        style={{
          color: isGhost ? "var(--p-ink70)" : "var(--p-ink30)",
          fontSize: 12,
          paddingRight: 2,
        }}
      >
        {isActive || !canOverlay ? (
          ""
        ) : isGhost ? (
          <svg
            width="13"
            height="13"
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
            width="13"
            height="13"
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

function TimelineRail({
  experiment,
  runs,
  activeRid,
  ghostPrefixes = [],
  onToggleGhost,
  dims,
}) {
  const [query, setQuery] = useState("");

  const canOverlay = dims === "1D";

  const filtered = useMemo(() => {
    if (!query.trim()) return runs;
    const q = query.toLowerCase();
    return runs.filter((r) =>
      `${r.rid ?? ""} ${r.prefix ?? ""}`.toLowerCase().includes(q),
    );
  }, [runs, query]);

  return (
    <div
      className="p-panel p-rail-timeline"
      style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <div className="p-panel-h">
        <span className="p-lbl">history</span>
        <span className="p-mono p-dim" style={{ fontSize: 11 }}>
          · {runs.length} run{runs.length === 1 ? "" : "s"}
        </span>
      </div>
      <div
        style={{
          padding: "6px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {experiment && (
          <div
            className="p-mono p-dim"
            style={{
              fontSize: 10.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={experiment}
          >
            of {experiment}
          </div>
        )}
        <input
          className="p-search p-mono"
          placeholder="filter by RID / prefix"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {canOverlay && (
          <div
            className="p-dim p-mono"
            style={{ fontSize: 10.5, padding: "0 2px" }}
          >
            tap a run to overlay it as a ghost
          </div>
        )}
      </div>
      {filtered.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            color: "var(--p-ink50)",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          No previous runs.
        </div>
      ) : (
        <div className="p-scroll" style={{ flex: 1, padding: "4px 6px 8px" }}>
          {filtered.map((r) => {
            const isActive = r.rid === activeRid;
            const isGhost = ghostPrefixes.includes(r.prefix);
            return (
              <TimelineRow
                key={r.prefix}
                r={r}
                isActive={isActive}
                isGhost={isGhost}
                canOverlay={canOverlay}
                onClick={() =>
                  !isActive && canOverlay && onToggleGhost(r.prefix)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

TimelineRail.propTypes = {
  experiment: PropTypes.string,
  runs: PropTypes.array.isRequired,
  activeRid: PropTypes.number,
  ghostPrefixes: PropTypes.array,
  onToggleGhost: PropTypes.func.isRequired,
  dims: PropTypes.string,
};

export default TimelineRail;
