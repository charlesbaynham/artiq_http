# ARTIQ System Logs API and UI

## Overview
Add an API endpoint and frontend view for system logs broadcast by the ARTIQ master. The server subscribes to the `log` notifier on startup and buffers entries for clients. For this iteration, clients fetch logs on page load and refresh the browser to see updates. Streaming via SSE will be added later on the existing SSE branch.

## Architecture

### Backend

#### `LogBuffer` (`artiq_http/artiq_api/log_buffer.py`)
A dedicated wrapper around `PersistentSubscriber` that owns a `PersistentSubscriber` for the `"log"` notifier and maintains a ring buffer of entries.

- **Ring buffer**: `collections.deque(maxlen=1000)` — prevents unbounded memory growth.
- **Entry extraction**: The log notifier data from ARTIQ may be a dict, list, or single entry. `LogBuffer` normalises whatever arrives into a flat list of entry dicts and appends them to the deque.
- **Interface**:
  - `async start()` / `async stop()` — delegate to the underlying subscriber.
  - `get_logs()` → `List[Dict]` — returns a *copy* of the current buffer as a list.
  - `is_ready()` → `bool` — true when the subscriber has received initial data.
  - `is_connected()` → `bool` — delegates to the underlying subscriber so the health endpoint works correctly.

#### `SubscriberManager` (`artiq_http/artiq_api/persistent_subscriber.py`)
- Add a `"logs"` entry that holds a `LogBuffer` instance.
- `start()` creates and starts the log buffer alongside existing subscribers.
- `stop()` stops the log buffer.
- Add `get_logs()` → `List[Dict]` that delegates to the log buffer.
- Add `get_logs_subscriber()` → `LogBuffer` for direct access if needed.

#### API Endpoint (`artiq_http/api.py`)
- `GET /api/logs` — returns `{"logs": [...]}`.
- Returns 503 with detail message if the log subscriber is not connected/initialised (same pattern as existing endpoints).

#### Data Model (`artiq_http/artiq_api/models.py`)
- `LogEntry` Pydantic model:
  - `timestamp: float` — Unix timestamp from ARTIQ.
  - `source: str` — component that generated the log (e.g., `"master"`, `"scheduler"`).
  - `level: int` — Python logging level integer.
  - `message: str` — log message text.
- `LogList` Pydantic model: `logs: List[LogEntry]`.

The endpoint attempts to validate raw ARTIQ data against `LogEntry`, but falls back to returning raw dicts if the shape differs (defensive against ARTIQ version variations).

### Frontend

#### `Logs.jsx` (`frontend/src/Logs.jsx`)
A React component that fetches and displays logs in a scrollable table.

- **Fetch**: calls `get_logs()` from `api/client.js` on mount.
- **Table columns**: Time (formatted from timestamp), Source, Level (rendered as a badge), Message.
- **Level badges**: color-coded — DEBUG (secondary), INFO (primary), WARNING (warning), ERROR (danger).
- **Container**: scrollable with `max-height` and `overflow-y: auto`.
- **Empty state**: shows a message when no logs are available.

#### `App.jsx` integration
- Add `"logs"` to the page routing logic (`getPageFromPath`).
- Add a `section-logs` row rendered when `currentPage === "logs"`.
- Add `"logs"` to the `routes` map in `handlePageChange`.
- Add `"logs"` to `MobileNavigation`.

#### `api/client.js`
- Add `get_logs()` function: `return api_fetch("api/logs")`.

### Testing

#### Unit tests (`tests/test_logs_api.py`)
- `test_logs_endpoint_returns_logs` — mock `subscriber_manager.get_logs()` to return sample entries, assert `GET /api/logs` returns them in the expected shape.
- `test_logs_endpoint_503_when_not_ready` — mock `subscriber_manager` so the log buffer is not initialised, assert 503 response.
- `test_logs_endpoint_empty_when_no_logs` — mock empty log buffer, assert `{"logs": []}`.

These tests use the existing `client` fixture from `conftest.py` and monkeypatch `subscriber_manager` methods.

#### Browser test
- Run backend (`python -m artiq_http.main`) and frontend dev server (`npm run dev`).
- Navigate to the Logs page.
- Verify the table renders and shows log entries (or the empty state when ARTIQ is not running).

## Error Handling
- Log subscriber disconnects are handled by `PersistentSubscriber` auto-reconnect; `LogBuffer` is passive and simply reflects whatever the subscriber has buffered.
- API returns 503 when ARTIQ is unreachable, consistent with other endpoints.
- Frontend handles fetch errors gracefully (same pattern as other pages).

## Future Work (out of scope)
- Real-time streaming via SSE on the existing `feature/sse-plot-updates` branch pattern.
- Log filtering by level or source.
- Search / full-text search in logs.
