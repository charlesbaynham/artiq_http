# Logs Refresh Button — Design

## Goal
Add a manual refresh button and auto-polling to the Logs view so users can see new log entries without reloading the page.

## Approach
Route-aware polling (Approach A). Auto-refresh every 5s when the user is on the Logs page and the browser tab is visible. A manual refresh button is always available.

## UI Changes

### Logs Component (`frontend/src/Logs.jsx`)
- Add a refresh button to the `logs-filter-bar`, positioned to the right of the entry count.
- Button uses `ArrowClockwise` icon from `react-bootstrap-icons` with `btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1` classes.
- Icon spins while a fetch is in flight.

### App Component (`frontend/src/App.jsx`)
- Pass `currentPage` prop to `<Logs currentPage={currentPage} />`.

## Data Flow
1. Extract the `useEffect` fetch body into a `fetchLogs()` callback.
2. The existing mount `useEffect` calls `fetchLogs()`.
3. A second `useEffect` sets up a 5-second interval. The interval callback checks `document.visibilityState === "visible"` and `currentPage === "logs"` before calling `fetchLogs()`.
4. A `visibilitychange` listener re-runs the interval check immediately when the tab becomes visible.
5. The refresh button calls `fetchLogs()` directly.

## Error Handling
- Failed refreshes show the existing `logs-error-banner`.
- Previously loaded logs are never cleared on refresh failure.
- In-flight requests are cancelled via the existing `cancelled` flag when the component unmounts or a new request starts.

## Edge Cases
- **Double-click refresh:** The existing `cancelled` pattern prevents race conditions. If `fetchLogs()` is called while another request is in flight, the old request's `cancelled` flag is set and its results are ignored.
- **Tab hidden:** Polling pauses. Resumes when the tab becomes visible again.
- **Not on logs page:** Polling pauses when `currentPage !== "logs"`.
