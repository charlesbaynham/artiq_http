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

### Backend Changes

#### New Health/Status Endpoint

##### [NEW] `GET /api/health`
Returns the connection status of the backend to the ARTIQ master. This endpoint will check if the PersistentSubscriber connections are active.

**Response format:**
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "artiq_connected": true | false,
  "details": {
    "explist": true | false,
    "schedule": true | false,
    "datasets": true | false
  }
}
```

**Implementation:**
- Use `subscriber_manager.is_connected()` for each subscriber
- Return `healthy` if all connected, `degraded` if some connected, `unhealthy` if none connected

---

### Frontend Changes

#### Error Detection and Handling

**Centralized Error Handling in API Client:**
- Modify `api_fetch()` in `client.js` to detect network errors and API failures
- Emit custom events for connection errors that can be caught globally
- Distinguish between network errors (backend unreachable) and API errors (backend connected but ARTIQ down)

**Health Check Polling:**
- Add periodic health check to `/api/health` endpoint
- Detect when backend becomes unreachable (network error)
- Detect when ARTIQ master becomes unreachable (health endpoint returns unhealthy status)

#### New Components

##### [NEW] `ConnectionErrorModal.jsx`
Modal component that displays connection error states:
- **Backend Unreachable:** "Cannot connect to backend server"
- **ARTIQ Unreachable:** "Backend cannot connect to ARTIQ master"
- Premium visual design with clear error messaging
- Blocks interaction with the rest of the UI
- Shows reconnection status
- Automatically dismisses when connection is restored

#### Integration with App

**Global Error State Management:**
- Add connection error state to `App.jsx`
- Monitor for connection errors from API calls
- Poll health endpoint periodically (every 5 seconds)
- Show/hide modal based on connection status

---

### Verification Plan

#### Automated Tests

**New test file:** `tests/test_health_endpoint.py`

Test the health endpoint:

```bash
# Run from project root
poetry run pytest tests/test_health_endpoint.py -v --realserver
```

Tests to implement:
1. `test_health_endpoint_healthy()` - Verify health endpoint returns healthy when ARTIQ is connected
2. `test_health_endpoint_structure()` - Verify response structure matches spec

#### Manual Verification

**Test 1: Backend Unreachable**
1. Start frontend dev server: `cd frontend && npm run dev`
2. Open browser to `http://localhost:5173`
3. Stop the backend: `Ctrl+C` in backend terminal
4. Wait a few seconds
5. **Expected:** Modal appears saying "Cannot connect to backend server"
6. Restart backend: `poetry run aqctl_artiq_http`
7. **Expected:** Modal disappears automatically

**Test 2: ARTIQ Master Unreachable**
1. Start both frontend and backend
2. Open browser to `http://localhost:5173`
3. Stop Docker ARTIQ stack: `cd test-artiq && docker compose down`
4. Wait ~10 seconds for backend to detect disconnection
5. **Expected:** Modal appears saying "Backend cannot connect to ARTIQ master"
6. Restart ARTIQ stack: `docker compose up -d`
7. **Expected:** Modal disappears automatically after reconnection

**Test 3: UI Interaction Blocked**
1. Trigger either error state
2. Try clicking on UI elements
3. **Expected:** Modal blocks all interactions, UI elements are not clickable

## Technical Considerations

- The frontend likely uses `EventSource` or long polling for updates; monitoring these for errors is key.
- The backend needs to expose its ARTIQ connection status (perhaps via a health endpoint or a specific event).
- Reconnection should be seamless; once the connection is back, the modal should disappear automatically.

## Acceptance Criteria

### Backend
- [ ] `GET /api/health` endpoint returns connection status
- [ ] Health endpoint checks all PersistentSubscriber connections
- [ ] Response includes overall status and per-subscriber details

### Frontend
- [ ] Modal appears when backend is unreachable (network error)
- [ ] Modal appears when ARTIQ master is unreachable (health check fails)
- [ ] Modal blocks UI interactions while displayed
- [ ] Modal disappears automatically when connection is restored
- [ ] Error messages clearly distinguish between backend and ARTIQ connection issues
- [ ] Visual design is premium and user-friendly

### Testing
- [ ] Automated tests verify health endpoint functionality
- [ ] Manual testing confirms modal behavior for both error states
- [ ] Reconnection logic works automatically

## Dependencies & Prerequisites

None identified.

## Notes

Created: 2026-01-18
Status: In Progress

### Progress Log

2026-01-18 19:24: Implementation plan created, awaiting user approval
