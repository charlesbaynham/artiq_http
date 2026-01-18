# Superhero Bootstrap Theme

## Top-Level Goal

Replace the current Bootstrap theme with the Superhero theme from Bootswatch to provide a modern, dark-themed interface that better suits the scientific and technical nature of ARTIQ control systems.

## Detailed Goal

### Problem Statement
The current Bootstrap theme uses a standard light color scheme that doesn't align well with the professional, technical aesthetic expected in scientific laboratory control interfaces. Many users working with ARTIQ systems prefer dark themes for reduced eye strain during extended use, and the default Bootstrap styling lacks the visual polish and modern appearance that would enhance the user experience.

### Expected Outcomes
- Modern, dark-themed interface with improved visual aesthetics
- Better contrast and readability for extended laboratory use
- Professional appearance that matches the technical nature of ARTIQ
- Consistent theming across all UI components (forms, buttons, cards, navigation)
- Maintained accessibility and responsive design

## Implementation Plan

<!-- To be filled in during implementation planning phase -->
1. Replace Bootstrap CSS with Bootswatch Superhero theme CDN link
2. Test all existing UI components for visual consistency
3. Adjust any custom CSS that may conflict with the new theme
4. Verify mobile responsiveness is maintained
5. Update any hardcoded colors to use theme variables

## Technical Considerations

The Superhero theme is a drop-in replacement for Bootstrap CSS, available via CDN at `https://bootswatch.com/5/superhero/bootstrap.min.css`. The implementation should:
- Replace the existing Bootstrap CSS link in the main HTML template
- Review custom CSS in the frontend to ensure compatibility
- Test with existing components (collapsible sections, forms, navigation, experiment lists)
- Ensure the dark theme doesn't negatively impact readability of data tables and parameter inputs

## Acceptance Criteria

<!-- To be defined during planning phase -->
- [ ] Superhero theme CSS is loaded and applied across all pages
- [ ] All UI components render correctly with the new theme
- [ ] Mobile responsiveness is maintained
- [ ] Custom CSS is updated to work harmoniously with the dark theme
- [ ] No visual regressions in experiment submission, scheduling, or dataset views
- [ ] Text contrast meets accessibility standards

## Dependencies & Prerequisites

None identified - this is a standalone UI enhancement that doesn't depend on backend changes or other features.

## Notes

Created: 2026-01-18
Status: Planning
