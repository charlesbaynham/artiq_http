import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";

function GhostIcon({ on }) {
  // on=true → filled ghost (overlay active), on=false → outline ghost (click to add)
  return on ? (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12 3C7.03 3 3 7.03 3 12v8l3-3 3 3 3-3 3 3 3-3 3 3v-8C21 7.03 16.97 3 12 3z" />
      <circle cx="9" cy="11" r="1.5" fill="var(--p-panel)" />
      <circle cx="15" cy="11" r="1.5" fill="var(--p-panel)" />
    </svg>
  ) : (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M12 3C7.03 3 3 7.03 3 12v8l3-3 3 3 3-3 3 3 3-3 3 3v-8C21 7.03 16.97 3 12 3z" />
      <circle cx="9" cy="11" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="11" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TimelineRow({
  r,
  isActive,
  isGhost,
  canOverlay,
  onClick,
  onToggleGhost,
}) {
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
        cursor: isActive ? "default" : "pointer",
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
        {canOverlay && !isActive && r.dims === "1D" ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleGhost(r.prefix);
            }}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            title={isGhost ? "remove ghost overlay" : "add ghost overlay"}
          >
            <GhostIcon on={isGhost} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TimelineRail({
  runs,
  activeRid,
  ghostPrefixes = [],
  onToggleGhost,
  onPick,
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

  const hasNonActiveRuns = runs.some((r) => r.rid !== activeRid);

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
        <div
          className="p-mono p-dim"
          style={{
            fontSize: 10.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          all runs
        </div>
        <input
          className="p-search p-mono"
          placeholder="filter by RID / prefix"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {canOverlay && hasNonActiveRuns && (
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
                onClick={() => !isActive && onPick(r)}
                onToggleGhost={onToggleGhost}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

TimelineRail.propTypes = {
  runs: PropTypes.array.isRequired,
  activeRid: PropTypes.number,
  ghostPrefixes: PropTypes.array,
  onToggleGhost: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
  dims: PropTypes.string,
};

export default TimelineRail;
