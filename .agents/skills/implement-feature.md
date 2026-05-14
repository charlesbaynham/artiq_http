---
description: Workflow for implementing an upcoming feature from the roadmap
---

This workflow guides you through implementing a feature from the roadmap, from planning to merge request.

## Overview

The `planning/roadmap.md` file tracks upcoming features. Each feature in the "Upcoming features" section links to a specific markdown file in the `planning/` directory (e.g., `planning/ui-pages-for-mobile.md`) that contains detailed goals, requirements, and implementation details.

## Process

### 1. Start a New Branch

Create a new feature branch for the work:

```bash
git checkout -b feature/<feature-name>
```

Regularly commit progress throughout the implementation:
- Make atomic commits with clear messages
- Commit after completing logical units of work
- Push to remote periodically to back up work

### 2. Create Implementation Plan

Review the feature's planning document (linked from `planning/roadmap.md`) and create a detailed implementation plan:

- Break down the feature into concrete, actionable tasks
- Identify technical dependencies and prerequisites
- Design the architecture and approach
- Consider testing requirements and verification steps
- Document the plan in the feature's planning document under "Implementation Plan"

### 3. Present Plan for User Review

Present the implementation plan to the user for review:

- Use the `notify_user` tool to request review of the updated planning document
- Highlight any critical design decisions or breaking changes
- Ask for clarification on ambiguous requirements
- Wait for user approval before proceeding

### 4. Incorporate Feedback and Implement

Once the plan is approved:

- Incorporate any user feedback into the plan
- Implement all features autonomously according to the approved plan
- Follow the implementation plan systematically
- Make regular commits as you complete tasks
- Use your judgment to handle minor implementation details
- Return to the user only if you encounter significant blockers or need clarification on requirements

### 5. Keep Notes in Planning Document

Throughout implementation, maintain the feature's planning document:

- **Status updates**: Update the status field (e.g., "Planning" → "In Progress" → "Testing" → "Complete")
- **Progress tracking**: Mark completed acceptance criteria with `[x]`
- **Learnings**: Document any insights, gotchas, or important decisions made during implementation
- **Plan adjustments**: If the implementation plan needs to change, document why and update accordingly
- **Notes section**: Add timestamped entries for significant milestones or decisions

Example notes format:
```markdown
## Notes

Created: 2026-01-18
Status: In Progress

### Progress Log

2026-01-18: Initial implementation plan created and approved
2026-01-19: Completed navigation bar component, discovered need for additional state management
2026-01-20: Implemented responsive layout system using CSS Grid
```

### 6. Test the Feature

Verify the implementation using appropriate testing methods:

- Use existing test workflows if applicable (e.g., `/frontend-testing`, `/test-local-artiq`)
- Write and run automated tests where appropriate
- Manually verify functionality
- Test edge cases and error handling
- Validate acceptance criteria from the planning document
- Document test results in the planning document

### 7. Complete and Create Merge Request

Once testing is complete and all acceptance criteria are met:

1. **Final commit**: Make a final commit with any remaining changes
2. **Push branch**: Push the feature branch to remote
   ```bash
   git push -u origin feature/<feature-name>
   ```
3. **Create merge request**: Create a merge request (MR) with:
   - Clear title describing the feature
   - Description linking to the planning document
   - Summary of what was implemented
   - Testing performed and results
   - Any breaking changes or migration notes
4. **Update roadmap**: Mark the feature as complete in `planning/roadmap.md` with `[x]`
5. **Update planning document**: Set status to "Complete" with completion date

## Tips

- **Stay organized**: Keep the planning document up to date throughout implementation
- **Commit often**: Small, frequent commits are easier to review and debug
- **Test incrementally**: Don't wait until the end to test; verify as you build
- **Document decisions**: Future you (or other developers) will appreciate notes on why certain choices were made
- **Ask when stuck**: If you encounter significant blockers or design questions, consult the user rather than making major assumptions
- **Reference workflows**: Use existing workflows like `/frontend-testing` or `/test-local-artiq` for testing

## Example Usage

**User**: "Implement the UI Pages for Mobile feature"

**Agent**:
1. Creates branch `feature/ui-pages-for-mobile`
2. Reviews `planning/ui-pages-for-mobile.md`
3. Creates detailed implementation plan
4. Presents plan to user for review
5. Implements feature autonomously after approval
6. Updates planning document with progress
7. Tests using `/frontend-testing` workflow
8. Pushes branch and creates merge request
