# Dataset Exploration

## Top-Level Goal

Provide a way to browse, search, and inspect ARTIQ datasets through the web UI.

## Detailed Goal

### Problem Statement
ARTIQ datasets can be large and numerous. Currently, there's no way to easily see what datasets are available or inspect their values without using the ARTIQ dashboard or custom scripts. This feature addresses the need for a central, searchable view of all broadcasted datasets.

### Expected Outcomes
- A new "Datasets" page in the navigation.
- Search and filtering by dataset name.
- Detailed view of dataset values (scalars, lists, and numpy arrays).
- Responsive design for mobile and desktop.

## Implementation Plan

### Backend Changes

#### New API Endpoints

Create two new granular endpoints to efficiently handle large datasets:

##### [NEW] `GET /api/datasets/names`
Returns a list of all available dataset names (keys only) from the PersistentSubscriber. This lightweight endpoint enables efficient browsing and searching without transferring large dataset values.

**Response format:**
```json
{
  "names": ["scope.channel1.voltage", "scope.channel2.current", "results", ...]
}
```

##### [NEW] `GET /api/datasets/values?names=...`
Returns values for specific datasets requested via query parameters. Supports multiple dataset names as comma-separated values.

**Request:** `GET /api/datasets/values?names=results,scope.channel1.voltage`

**Response format:**
```json
{
  "results": [true, 42, {}],
  "scope.channel1.voltage": [false, 3.14, {}]
}
```

Both endpoints will leverage the existing `PersistentSubscriber` infrastructure (`subscriber_manager.get_datasets()`) to avoid redundant ARTIQ master requests.

---

### Frontend Changes

#### New API Client Functions

Add to `frontend/src/api/client.js`:
- `get_dataset_names()` - Fetch all dataset names
- `get_dataset_values(names)` - Fetch values for specific datasets

#### New Components

##### [NEW] `DatasetExplorer.jsx`
Main component for the datasets section/page. Features:
- Search bar for filtering dataset names
- Hierarchical tree view using `.` as separator
- Selected dataset display area
- Responsive layout (collapsible section on desktop, separate page on mobile)

##### [NEW] `DatasetTree.jsx`
Reusable tree component for hierarchical browsing:
- Collapsible nodes for dataset groups (e.g., `scope.*`)
- Click to select individual datasets
- Visual indication of selected items

##### [NEW] `DatasetValue.jsx`
Component to display dataset values with proper formatting:
- Scalars: display as-is
- Lists/arrays: formatted display with expand/collapse for large arrays
- Handle ARTIQ dataset format: `[persist, value, metadata]`

#### Integration with App

Update `App.jsx`:
- Add `DatasetExplorer` as a new collapsible section (desktop)
- Integrate with existing mobile navigation pattern from UI Pages for Mobile feature

---

### Verification Plan

#### Automated Tests

**New test file:** `tests/test_datasets_api.py`

Test the new API endpoints against the Docker ARTIQ stack:

```bash
# Run from project root
pytest tests/test_datasets_api.py -v
```

Tests to implement:
1. `test_get_dataset_names()` - Verify `/api/datasets/names` returns list of names
2. `test_get_dataset_values_single()` - Request single dataset value
3. `test_get_dataset_values_multiple()` - Request multiple dataset values
4. `test_get_dataset_values_nonexistent()` - Handle non-existent dataset names gracefully

**Existing test to verify:** `tests/test_artiq_stack.py::test_datasets_after_exp`
- Ensure existing dataset functionality still works after refactoring

#### Manual Verification

Use the `/frontend-testing` workflow:

1. **Start the application:**
   ```bash
   # Terminal 1: Start backend
   uv run aqctl_artiq_http

   # Terminal 2: Start frontend dev server
   cd frontend && npm run dev
   ```

2. **Test dataset exploration:**
   - Open browser to `http://localhost:5173`
   - Navigate to "Datasets" section (desktop) or page (mobile)
   - Verify search functionality filters dataset names
   - Click on datasets to view their values
   - Verify hierarchical tree structure displays correctly
   - Test responsive behavior by resizing browser window

3. **Test with real data:**
   - Use `/test-local-artiq` workflow to start Docker ARTIQ stack
   - Submit an experiment that creates datasets (e.g., `simple_exp.py`)
   - Verify datasets appear in the explorer
   - Verify values are displayed correctly

## Technical Considerations

The existing `/api/datasets` endpoint is too broad for large datasets. New, more granular endpoints should be implemented:
- `GET /api/datasets/names`: Returns a list of all available dataset names.
- `GET /api/datasets/values?names=...`: Returns the values for a specific selection of datasets.

These endpoints should leverage the existing `PersistentSubscriber` data structure in the backend to provide efficient views of the datasets without redundant ARTIQ master requests.

## Acceptance Criteria

### Backend
- [x] `GET /api/datasets/names` endpoint returns list of dataset names
- [x] `GET /api/datasets/values?names=...` endpoint returns values for requested datasets
- [x] Both endpoints use existing PersistentSubscriber infrastructure
- [x] Automated tests pass for new endpoints

### Frontend
- [x] Datasets section/page is accessible from main navigation
- [x] Search bar filters dataset names in real-time
- [x] Hierarchical tree view displays datasets grouped by `.` separator
- [x] Clicking a dataset fetches and displays its value
- [x] Dataset values display correctly (scalars, lists, arrays)
- [x] Layout is responsive (collapsible section on desktop, page on mobile)
- [x] Integration with existing mobile navigation works seamlessly

### Testing
- [x] All automated tests pass
- [x] Manual testing confirms UI functionality
- [x] Feature works with Docker ARTIQ stack

## Dependencies & Prerequisites

None identified. The backend infrastructure for dataset broadcasting via `PersistentSubscriber` is already implemented.

## Notes

Created: 2026-01-18
Status: Complete
Completed: 2026-01-18

### Progress Log

2026-01-18 19:18: Implementation plan created and approved
2026-01-18 19:22: Implementation completed - all tests passing, frontend builds successfully
