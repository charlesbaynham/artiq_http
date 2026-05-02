import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

import { get_logs } from "./api/client";

const LEVEL_INFO = [
  { name: "CRITICAL", min: 50, variant: "danger" },
  { name: "ERROR", min: 40, variant: "danger" },
  { name: "WARNING", min: 30, variant: "warning" },
  { name: "INFO", min: 20, variant: "primary" },
  { name: "DEBUG", min: 10, variant: "secondary" },
];

function levelInfoFor(level) {
  if (typeof level !== "number") {
    return { name: String(level ?? ""), variant: "secondary" };
  }
  for (const info of LEVEL_INFO) {
    if (level >= info.min) return info;
  }
  return { name: String(level), variant: "secondary" };
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
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="logs-view">
      {error && <Alert variant="danger">{error}</Alert>}

      {logs.length === 0 ? (
        <div className="text-muted p-3">No log entries available.</div>
      ) : (
        <div
          className="border rounded"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <Table size="sm" hover className="mb-0">
            <thead className="sticky-top bg-body">
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Time</th>
                <th>Source</th>
                <th>Level</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry, idx) => {
                const { name, variant } = levelInfoFor(entry.level);
                return (
                  <tr key={idx}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatTimestamp(entry.timestamp)}
                    </td>
                    <td>{entry.source ?? ""}</td>
                    <td>
                      <Badge bg={variant}>{name}</Badge>
                    </td>
                    <td style={{ whiteSpace: "pre-wrap" }}>
                      {entry.message ?? ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Logs;
