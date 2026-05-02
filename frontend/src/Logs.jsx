import React, { useEffect, useState } from "react";

import { get_logs } from "./api/client";

const LEVEL_INFO = [
  { name: "CRITICAL", min: 50, className: "log-level-critical" },
  { name: "ERROR", min: 40, className: "log-level-error" },
  { name: "WARNING", min: 30, className: "log-level-warning" },
  { name: "INFO", min: 20, className: "log-level-info" },
  { name: "DEBUG", min: 10, className: "log-level-debug" },
];

function levelInfoFor(level) {
  if (typeof level !== "number") {
    return { name: String(level ?? ""), className: "log-level-debug" };
  }
  for (const info of LEVEL_INFO) {
    if (level >= info.min) return info;
  }
  return { name: String(level), className: "log-level-debug" };
}

function formatTimestamp(ts) {
  if (typeof ts !== "number" || Number.isNaN(ts)) return "";
  const d = new Date(ts * 1000);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    get_logs()
      .then((data) => {
        if (cancelled) return;
        setLogs(Array.isArray(data?.logs) ? data.logs : []);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(`Failed to load logs: ${err.message}`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="logs-loading">
        <div className="logs-spinner" aria-label="Loading logs" />
        <span>Loading logs…</span>
      </div>
    );
  }

  return (
    <div className="logs-container">
      {error && (
        <div className="logs-error-banner" role="alert">
          {error}
        </div>
      )}

      {logs.length === 0 ? (
        <div className="logs-empty-state">No log entries available.</div>
      ) : (
        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Level</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry, idx) => {
                const { name, className } = levelInfoFor(entry.level);
                return (
                  <tr key={idx}>
                    <td className="logs-timestamp">
                      {formatTimestamp(entry.timestamp)}
                    </td>
                    <td>{entry.source ?? ""}</td>
                    <td>
                      <span className={`log-level-pill ${className}`}>
                        {name}
                      </span>
                    </td>
                    <td className="logs-message">{entry.message ?? ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Logs;
