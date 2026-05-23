import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import DimBadge from "./DimBadge";

// Searchable recent-runs dropdown, grouped by experiment (fragment_fqn).
function RunSwitcher({ recentRuns, currentPrefix, onPick }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current =
    recentRuns.find((r) => r.prefix === currentPrefix) || recentRuns[0];

  const filtered = useMemo(() => {
    if (!query.trim()) return recentRuns;
    const q = query.toLowerCase();
    return recentRuns.filter((r) =>
      `${r.rid ?? ""} ${r.expName ?? ""} ${r.prefix ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [recentRuns, query]);

  const groups = useMemo(() => {
    const m = new Map();
    for (const r of filtered) {
      if (!m.has(r.expName)) m.set(r.expName, { dims: r.dims, runs: [] });
      m.get(r.expName).runs.push(r);
    }
    return [...m.entries()];
  }, [filtered]);

  if (!current) {
    return (
      <button className="p-btn" disabled>
        <span className="p-dim">no scans</span>
      </button>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="p-btn"
        onClick={() => setOpen((o) => !o)}
        style={{ height: 30, paddingRight: 6 }}
      >
        <DimBadge dims={current.dims} accent />
        <span
          className="p-mono"
          style={{ color: "var(--p-accent)", fontWeight: 600 }}
        >
          {current.rid != null ? `#${current.rid}` : current.prefix}
        </span>
        <span style={{ fontWeight: 600 }}>{current.expName}</span>
        <span className="p-dim" style={{ fontSize: 11, marginLeft: 4 }}>
          ▾
        </span>
      </button>
      {open && (
        <div
          className="p-panel"
          style={{
            position: "absolute",
            top: 36,
            left: 0,
            width: 440,
            maxHeight: 460,
            zIndex: 50,
            boxShadow: "0 12px 32px rgba(0,0,0,.14)",
            padding: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{ padding: 8, borderBottom: "1px solid var(--p-border)" }}
          >
            <input
              className="p-search p-mono"
              autoFocus
              placeholder="search runs · RID · experiment"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="p-scroll" style={{ flex: 1, padding: "4px 4px 8px" }}>
            {groups.length === 0 && (
              <div
                style={{
                  padding: 18,
                  textAlign: "center",
                  color: "var(--p-ink50)",
                  fontSize: 12,
                }}
              >
                no matches
              </div>
            )}
            {groups.map(([expName, group]) => (
              <div key={expName} style={{ padding: "4px 4px 6px" }}>
                <div
                  className="p-lbl"
                  style={{
                    padding: "6px 8px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <DimBadge dims={group.dims} size={11} />
                  <span
                    style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {expName}
                  </span>
                  <span className="p-dim" style={{ marginLeft: "auto" }}>
                    · {group.runs.length}
                  </span>
                </div>
                {group.runs.map((r) => (
                  <div
                    key={r.prefix}
                    className={
                      "p-row" + (r.prefix === currentPrefix ? " on" : "")
                    }
                    onClick={() => {
                      onPick(r);
                      setOpen(false);
                    }}
                    style={{
                      alignItems: "center",
                      gap: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      className="p-mono"
                      style={{
                        color: "var(--p-accent)",
                        minWidth: 64,
                        fontWeight: 500,
                      }}
                    >
                      {r.rid != null ? `#${r.rid}` : r.prefix}
                    </span>
                    <span
                      className="p-dim p-mono"
                      style={{
                        fontSize: 10.5,
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.prefix}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "8px 12px",
              borderTop: "1px solid var(--p-border)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
            }}
          >
            <span className="p-dim">
              {recentRuns.length} runs across{" "}
              {new Set(recentRuns.map((r) => r.expName)).size} experiments
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

RunSwitcher.propTypes = {
  recentRuns: PropTypes.array.isRequired,
  currentPrefix: PropTypes.string,
  onPick: PropTypes.func.isRequired,
};

export default RunSwitcher;
