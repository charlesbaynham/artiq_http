import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";

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

const POLL_INTERVAL = 5000;

function Logs({ currentPage }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [levelFilter, setLevelFilter] = useState(20);
  const latestRequestRef = useRef(0);

  const fetchLogs = useCallback(async (isBackground = false) => {
    const requestId = Date.now();
    latestRequestRef.current = requestId;

    if (!isBackground) setLoading(true);
    else setRefreshing(true);

    try {
      const data = await get_logs();
      if (latestRequestRef.current !== requestId) return;
      setLogs(Array.isArray(data?.logs) ? data.logs : []);
      setError(null);
    } catch (err) {
      if (latestRequestRef.current !== requestId) return;
      setError(`Failed to load logs: ${err.message}`);
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLogs(false);
  }, [fetchLogs]);

  // Auto-poll every 5s when on logs page and tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && currentPage === "logs") {
        fetchLogs(true);
      }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLogs, currentPage]);

  // Fetch immediately when tab becomes visible
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && currentPage === "logs") {
        fetchLogs(true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchLogs, currentPage]);

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
          <button
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
            onClick={() => fetchLogs(true)}
            disabled={refreshing}
            aria-label="Refresh logs"
          >
            <ArrowClockwise
              className={refreshing ? "logs-icon-spin" : ""}
              aria-hidden="true"
            />
            Refresh
          </button>
        </div>
      )}

      {filteredLogs.length === 0 ? (
        <div className="logs-empty-state">
          {logs.length === 0
            ? "No log entries available."
            : "No log entries match the selected filter."}
        </div>
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
