import { useState, useEffect, useCallback, useRef } from "react";

const isDev = import.meta.env.DEV;
const baseURL = isDev ? "http://localhost:8000" : window.location.origin;

/**
 * Connection states for SSE
 */
export const SSEState = {
  CONNECTING: "connecting",
  CONNECTED: "connected",
  RECONNECTING: "reconnecting",
  ERROR: "error",
  CLOSED: "closed",
};

/**
 * Custom hook for streaming dataset updates via SSE
 *
 * @param {string} prefix - The NDScan prefix to stream (e.g., "ndscan.rid_1")
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether to enable the SSE connection (default: true)
 * @param {number} options.reconnectDelay - Delay before reconnecting on error (default: 3000ms)
 * @returns {Object} - { data, connectionState, error }
 */
export function useSSEDataset(prefix, options = {}) {
  const { enabled = true, reconnectDelay = 3000 } = options;

  const [data, setData] = useState(null);
  const [connectionState, setConnectionState] = useState(SSEState.CLOSED);
  const [error, setError] = useState(null);

  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const lastConnectionAttemptRef = useRef(0);

  // Merge update data into existing data
  const mergeUpdate = useCallback((updateData) => {
    setData((prevData) => {
      if (!prevData) return updateData;
      return { ...prevData, ...updateData };
    });
  }, []);

  // Handle delete event
  const handleDelete = useCallback((key) => {
    setData((prevData) => {
      if (!prevData) return prevData;
      const newData = { ...prevData };
      delete newData[key];
      return newData;
    });
  }, []);

  // Connect to SSE endpoint
  const connect = useCallback(() => {
    if (!prefix || !enabled) return;

    // Rate-limit reconnection attempts to 1 per second
    const now = Date.now();
    const timeSinceLastAttempt = now - lastConnectionAttemptRef.current;
    const minReconnectInterval = 1000; // 1 second minimum

    if (timeSinceLastAttempt < minReconnectInterval) {
      // Schedule the connection attempt after the rate limit period
      const delay = minReconnectInterval - timeSinceLastAttempt;
      reconnectTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current && enabled) {
          connect();
        }
      }, delay);
      return;
    }

    lastConnectionAttemptRef.current = now;

    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionState(SSEState.CONNECTING);
    setError(null);

    const url = `${baseURL}/api/datasets/stream/${encodeURIComponent(prefix)}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("init", (event) => {
      if (!mountedRef.current) return;
      try {
        const initData = JSON.parse(event.data);
        setData(initData);
        setConnectionState(SSEState.CONNECTED);
        setError(null);
      } catch (e) {
        console.error("Failed to parse init event:", e);
      }
    });

    eventSource.addEventListener("update", (event) => {
      if (!mountedRef.current) return;
      try {
        const updateData = JSON.parse(event.data);
        mergeUpdate(updateData);
      } catch (e) {
        console.error("Failed to parse update event:", e);
      }
    });

    eventSource.addEventListener("delete", (event) => {
      if (!mountedRef.current) return;
      try {
        const { key } = JSON.parse(event.data);
        handleDelete(key);
      } catch (e) {
        console.error("Failed to parse delete event:", e);
      }
    });

    eventSource.addEventListener("heartbeat", () => {
      // Heartbeat received, connection is alive. Use functional setState so
      // `connectionState` does not need to be a dep of `connect` (which would
      // re-create the callback on every state change and thrash the effect).
      if (!mountedRef.current) return;
      setConnectionState((prev) =>
        prev === SSEState.CONNECTED ? prev : SSEState.CONNECTED,
      );
    });

    eventSource.addEventListener("error", (event) => {
      if (!mountedRef.current) return;
      try {
        const errorData = JSON.parse(event.data);
        setError(errorData.message);
        setConnectionState(SSEState.ERROR);
      } catch {
        // Not a JSON error event, likely connection error
        setConnectionState(SSEState.ERROR);
      }
    });

    eventSource.onerror = () => {
      if (!mountedRef.current) return;

      eventSource.close();
      setConnectionState(SSEState.RECONNECTING);

      // Schedule reconnection
      reconnectTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current && enabled) {
          connect();
        }
      }, reconnectDelay);
    };

    eventSource.onopen = () => {
      if (!mountedRef.current) return;
      // Connection opened, but waiting for init event to confirm
    };
  }, [prefix, enabled, reconnectDelay, mergeUpdate, handleDelete]);

  // Connect when prefix changes or component mounts
  useEffect(() => {
    mountedRef.current = true;

    if (enabled && prefix) {
      connect();
    }

    return () => {
      mountedRef.current = false;

      // Cleanup
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      setConnectionState(SSEState.CLOSED);
    };
  }, [prefix, enabled, connect]);

  return {
    data,
    connectionState,
    error,
    isConnected: connectionState === SSEState.CONNECTED,
    isConnecting:
      connectionState === SSEState.CONNECTING ||
      connectionState === SSEState.RECONNECTING,
  };
}

export default useSSEDataset;
