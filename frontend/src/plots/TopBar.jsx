import React from "react";
import PropTypes from "prop-types";
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

function TopBar({
  recentRuns,
  currentPrefix,
  onPick,
  progress,
  status,
  theme,
  onTheme,
}) {
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

      <div style={{ flex: 1 }} />

      <button
        className="p-btn ghost icon"
        title={theme === "dark" ? "switch to light" : "switch to dark"}
        onClick={onTheme}
        aria-label="toggle theme"
      >
        {theme === "dark" ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
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
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}

TopBar.propTypes = {
  recentRuns: PropTypes.array.isRequired,
  currentPrefix: PropTypes.string,
  onPick: PropTypes.func.isRequired,
  progress: PropTypes.string,
  status: PropTypes.string,
  theme: PropTypes.string,
  onTheme: PropTypes.func,
};

export default TopBar;
