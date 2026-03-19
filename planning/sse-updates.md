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

<!-- To be filled in during implementation planning phase -->
1. Task breakdown pending

## Technical Considerations

### Backend
-   Continue using **FastAPI** for the implementation.
-   Utilize the existing subscriber pattern (`PersistentSubscriber`) if applicable, or adapt it for streaming specific dataset updates.

### Frontend
-   Use a simple **React**-based approach.
-   No complicated third-party libraries; rely on standard `EventSource` or simple wrappers.

## Acceptance Criteria

- [ ] Plots load existing data immediately upon open.
- [ ] Updates appear in real-time as the experiment runs.
- [ ] Network tab shows a single persistent connection per plot instead of repeated polls.
- [ ] Connection connects on mount and disconnects on unmount.
- [ ] Large datasets do not choke the connection with redundant data transfers.

## Dependencies & Prerequisites
-   Existing `PersistentSubscriber` infrastructure (may need refactoring or extension).

## Notes
Created: 2026-01-18
Status: Planning
