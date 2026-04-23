# Use SSE for Plot Updates

## Top-Level Goal
Implement Server Sent Events (SSE) to stream dataset updates to plots in real-time, replacing the current polling mechanism.

## Detailed Goal

### Problem Statement
The current polling approach has significant drawbacks:
1.  **Latency**: Plots are slow to update, creating a laggy user experience.
2.  **Performance & Bandwidth**: As datasets grow large, polling transfers the entire dataset repeatedly. This consumes excessive bandwidth and puts unnecessary strain on both the server and the client connection.

### Expected Outcomes
1.  **Real-time streaming**: Plots update immediately as new data arrives on the server.
2.  **Efficient Data Transfer**: Only new data (or efficient updates) is sent after the initial load.
3.  **Connection Management**:
    *   Opening a plot establishes an SSE connection and streams all existing data immediately.
    *   Closing a plot (or navigating away) strictly closes the connection to conserve resources.

## Implementation Plan

### Backend Changes

#### 1. PersistentSubscriber Callback System (`artiq_api/persistent_subscriber.py`)

Added change callback registration to enable SSE streaming:
- `register_change_callback(callback)` - Register a callback for data changes
- `unregister_change_callback(callback)` - Remove a registered callback
- `_notify_change_listeners(mod)` - Internal method to notify all callbacks
- `get_datasets_subscriber()` - Method on SubscriberManager to expose datasets subscriber

#### 2. SSE Streaming Module (`artiq_http/sse.py`)

New FastAPI router with `/api/datasets/stream/{prefix:path}` endpoint:

**Event Types:**
- `init` - Full dataset state for the prefix on connection
- `update` - Individual dataset value changes
- `delete` - Dataset removed
- `heartbeat` - Keep-alive signal (every 15 seconds)
- `error` - Error occurred

**Features:**
- Prefix-based filtering (only streams datasets matching `{prefix}.*`)
- Automatic heartbeat to keep connection alive
- Proper cleanup on connection close
- JSON sanitization for numpy types

---

### Frontend Changes

#### 1. SSE Hook (`hooks/useSSEDataset.js`)

Custom React hook for managing SSE connections:

```javascript
const { data, connectionState, error, isConnected, isConnecting } = useSSEDataset(prefix);
```

**Features:**
- Connection state management (CONNECTING, CONNECTED, RECONNECTING, ERROR, CLOSED)
- Automatic reconnection with configurable delay
- Data merging for incremental updates
- Proper cleanup on unmount

#### 2. NDScanPlot Component Update

Rewrote `NDScanPlot.jsx` to use SSE:
- Uses `useSSEDataset` hook instead of one-time fetch
- Displays connection status indicator (Live/Connecting/Error badges)
- Shows point count and completion status
- Handles all plot types (0D, 1D, 2D)

---

## Technical Considerations

### Backend
-   **FastAPI StreamingResponse** for SSE with proper headers
-   Callback-based change detection for efficient updates
-   Prefix filtering to minimize data transfer

### Frontend
-   Native **EventSource** API for SSE connections
-   React hooks for clean state management
-   Auto-reconnect on connection loss

## Acceptance Criteria

- [x] Plots load existing data immediately upon open.
- [x] Updates appear in real-time as the experiment runs.
- [x] Network tab shows a single persistent connection per plot instead of repeated polls.
- [x] Connection connects on mount and disconnects on unmount.
- [x] Large datasets do not choke the connection with redundant data transfers.

## Dependencies & Prerequisites
-   Existing `PersistentSubscriber` infrastructure (extended with callback system).

## Notes
Created: 2026-01-18
Status: Complete
Completed: 2026-01-18
