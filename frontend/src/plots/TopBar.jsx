import React, { useState } from "react";
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

function CopyButton({ onCopy }) {
  const [state, setState] = useState("idle"); // 'idle' | 'copying' | 'copied'

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("copying");
    try {
      await onCopy();
      setState("copied");
      setTimeout(() => setState("idle"), 1500);
    } catch (err) {
      console.error("Plot copy failed:", err);
      setState("idle");
    }
  };

  return (
    <button
      className="p-btn ghost icon"
      title={state === "copied" ? "Copied!" : "Copy plot as PNG"}
      aria-label="copy plot as PNG"
      onClick={handleClick}
      disabled={state === "copying"}
      style={state === "copied" ? { color: "var(--p-ok)" } : undefined}
    >
      {state === "copied" ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
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
          <rect x="9" y="2" width="6" height="4" rx="1" />
          <path d="M9 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-3" />
        </svg>
      )}
    </button>
  );
}

function TopBar({
  recentRuns,
  currentPrefix,
  onPick,
  progress,
  status,
  onCopy,
}) {
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

      {onCopy && <CopyButton onCopy={onCopy} />}

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
  onCopy: PropTypes.func,
};

CopyButton.propTypes = {
  onCopy: PropTypes.func.isRequired,
};

export default TopBar;
