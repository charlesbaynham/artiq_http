import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RunSwitcher from "./RunSwitcher";

function Wordmark() {
  return (
    <span className="p-wordmark" style={{ fontSize: 13 }}>
      ARTIQ
      <span className="p-dot" />
      <span style={{ fontWeight: 500, color: "var(--p-ink70)" }}>plots</span>
    </span>
  );
}

function TopBar({ recentRuns, currentPrefix, onPick, progress, status }) {
  const navigate = useNavigate();
  return (
    <div className="p-topbar">
      <Wordmark />
      <span className="p-dim2" style={{ fontSize: 11 }}>
        /
      </span>
      <RunSwitcher
        recentRuns={recentRuns}
        currentPrefix={currentPrefix}
        onPick={onPick}
      />

      {status === "live" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="p-live-dot" />
          <span
            className="p-mono"
            style={{ color: "var(--p-live)", fontSize: 11.5 }}
          >
            LIVE
          </span>
          {progress && (
            <span className="p-mono p-dim" style={{ fontSize: 11.5 }}>
              · {progress}
            </span>
          )}
        </div>
      )}
      {status === "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="p-pill ok">✓ done</span>
        </div>
      )}
      {status === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className="p-pill"
            style={{
              background: "color-mix(in oklab, var(--p-err) 14%, transparent)",
              color: "var(--p-err)",
            }}
          >
            ! error
          </span>
        </div>
      )}
      {status === "connecting" && (
        <span className="p-mono p-dim" style={{ fontSize: 11.5 }}>
          connecting…
        </span>
      )}

      <button
        className="p-btn ghost icon"
        title="fullscreen"
        aria-label="open fullscreen"
        onClick={() => navigate("/plots/fullscreen")}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>

      <div style={{ flex: 1 }} />
    </div>
  );
}

TopBar.propTypes = {
  recentRuns: PropTypes.array.isRequired,
  currentPrefix: PropTypes.string,
  onPick: PropTypes.func.isRequired,
  progress: PropTypes.string,
  status: PropTypes.string,
};

export default TopBar;
