# Logs Refresh Button

## Overview
Add a manual refresh button and auto-polling (every 5s) to the Logs view, active only when the user is on the Logs page and the browser tab is visible.

## UI
- Add a refresh button to the existing `logs-filter-bar`, positioned to the right of the entry count.
- Use `ArrowClockwise` from `react-bootstrap-icons` with `btn btn-sm btn-outline-primary` styling, matching the `DatasetExplorer` refresh button.
- During fetch, the icon spins via a CSS animation class.

## Data Flow
- Extract the current `useEffect` fetch logic in `Logs.jsx` into a reusable `fetchLogs()` function.
- The refresh button calls `fetchLogs()` on click.
- An interval calls `fetchLogs()` every 5s when two conditions are met:
  1. `currentPage === "logs"`
  2. `document.visibilityState === "visible"`
- A `visibilitychange` event listener pauses/resumes the interval so fetches don't fire in background tabs.

## Component Changes
- `Logs` accepts a new `currentPage` prop from `App`.
- No changes to `CollapsibleSection` or other components.

## Error Handling
- Failed refreshes display the existing error banner.
- Previously loaded logs are preserved on refresh failure.

## Edge Cases
- If the user clicks refresh while a fetch is already in flight, the new request is ignored via the existing `cancelled` flag pattern.
- On mobile, `currentPage === "logs"` corresponds to the active page.
- On desktop, `currentPage === "logs"` corresponds to the user having navigated to the Logs section.
