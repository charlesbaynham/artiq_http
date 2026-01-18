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

<!-- To be filled in during implementation planning phase -->
1. Task breakdown pending

## Technical Considerations

The existing `/api/datasets` endpoint is too broad for large datasets. New, more granular endpoints should be implemented:
- `GET /api/datasets/names`: Returns a list of all available dataset names.
- `GET /api/datasets/values?names=...`: Returns the values for a specific selection of datasets.

These endpoints should leverage the existing `PersistentSubscriber` data structure in the backend to provide efficient views of the datasets without redundant ARTIQ master requests.

## Acceptance Criteria

<!-- To be defined during planning phase -->
- [ ] Datasets page/section is accessible from the main navigation.
- [ ] User can browse datasets hierarchically using the `.` separator.
- [ ] User can search for datasets by name.
- [ ] Dataset values are displayed correctly, only fetching data for selected datasets.
- [ ] Layout is responsive on mobile devices.

## Dependencies & Prerequisites

None identified. The backend infrastructure for dataset broadcasting via `PersistentSubscriber` is already implemented.

## Notes

Created: 2026-01-18
Status: Planning
