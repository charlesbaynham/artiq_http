# URL Path Encoding

## Top-Level Goal

URLs should encode paths to the part of the interface that's in focus, allowing for bookmarking, sharing of specific views, and functional browser navigation (Back/Forward).

## Detailed Goal

### Problem Statement
The current UI does not reflect its state in the URL. If a user navigates into a specific dataset or experiment section and then refreshes the page or shares the link, the UI resets to the default view. This loses context and hinders collaboration and workflow efficiency.

### Expected Outcomes
- The URL updates dynamically as the user navigates through different sections of the interface.
- Users can deep-link directly to specific views (e.g., a specific dataset's exploration page).
- Refreshing the page preserves the user's current view and state.
- **Browser Back and Forward buttons work as expected**, allowing natural navigation through the history of focused views.

## Implementation Plan

<!-- To be filled in during implementation planning phase -->
1. Task breakdown pending (likely involving React Router integration).

## Technical Considerations

- Integration with existing React state management.
- Mapping hierarchical UI states to URL paths (e.g., `/datasets/abc` or `/schedule`).
- Handling transition between mobile navigation (bottom bar) and URL state.

## Acceptance Criteria

<!-- To be defined during planning phase -->
- [ ] Navigating to a different section updates the URL without a full page reload.
- [ ] Pasting a encoded URL into a new tab loads the correct view immediately.
- [ ] Using the browser's Back button returns the UI to the previous view.
- [ ] Using the browser's Forward button returns the UI to the next view in history.

## Dependencies & Prerequisites

None identified beyond standard frontend routing libraries.

## Notes

Created: 2026-01-18
Status: Planning
