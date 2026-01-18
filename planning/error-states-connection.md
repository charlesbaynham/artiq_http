# Error States for Connection

## Top-Level Goal

Provide feedback to the user for error states, either if the backend is not connected to the ARTIQ server, or if the frontend is not connected to the backend.

## Detailed Goal

### Problem Statement
Users currently cannot know if the interface is working. If the connection to the backend or the ARTIQ master is lost, the UI might stay in a stale state without notifying the user, leading to confusion.

### Expected Outcomes
- A modal dialog should appear when a connection loss is detected.
- This modal should prevent interaction with the interface until the connection is automatically restored.
- Verification that existing reconnection logic works as expected or implementation of new logic if missing.

## Implementation Plan

<!-- To be filled in during implementation planning phase -->
1. Investigate current backend-to-ARTIQ connection monitoring.
2. Investigate current frontend-to-backend connection monitoring (EventSource/Fetch).
3. Design and implement a reusable Modal component for connection errors.
4. Integrate the error modal into the main application state.
5. Verify automatic reconnection logic.

## Technical Considerations

- The frontend likely uses `EventSource` or long polling for updates; monitoring these for errors is key.
- The backend needs to expose its ARTIQ connection status (perhaps via a health endpoint or a specific event).
- Reconnection should be seamless; once the connection is back, the modal should disappear automatically.

## Acceptance Criteria

- [ ] Modal dialog appears when backend is unreachable from frontend.
- [ ] Modal dialog appears when ARTIQ master is unreachable from backend.
- [ ] Interface is locked (interactions prevented) while modal is active.
- [ ] Modal disappears automatically once connection is restored.
- [ ] Visual design is premium and clearly indicates the error type.

## Dependencies & Prerequisites

None identified.

## Notes

Created: 2026-01-18
Status: Planning
