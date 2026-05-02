import React, { useEffect, useMemo, useState } from "react";

import { get_logs } from "./api/client";

const LEVEL_INFO = [
  { name: "CRITICAL", value: 50, className: "log-level-critical" },
  { name: "ERROR", value: 40, className: "log-level-error" },
  { name: "WARNING", value: 30, className: "log-level-warning" },
  { name: "INFO", value: 20, className: "log-level-info" },
  { name: "DEBUG", value: 10, className: "log-level-debug" },
];

function levelInfoFor(level) {
  if (typeof level !== "number") {
    return { name: String(level ?? ""), className: "log-level-debug" };
  }
  for (const info of LEVEL_INFO) {
    if (level >= info.value) return info;
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
  const [levelFilter, setLevelFilter] = useState(20);

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

  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      const level = typeof entry.level === "number" ? entry.level : 0;
      return level >= levelFilter;
    });
  }, [logs, levelFilter]);

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

      {!error && logs.length > 0 && (
        <div className="logs-filter-bar">
          <label htmlFor="log-level-filter">Minimum level:</label>
          <select
            id="log-level-filter"
            value={levelFilter}
            onChange={(e) => setLevelFilter(Number(e.target.value))}
          >
            {LEVEL_INFO.map((info) => (
              <option key={info.value} value={info.value}>
                {info.name}
              </option>
            ))}
          </select>
          <span className="logs-count">{filteredLogs.length} entries</span>
        </div>
      )}

      {filteredLogs.length === 0 ? (
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
              {filteredLogs.map((entry, idx) => {
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
