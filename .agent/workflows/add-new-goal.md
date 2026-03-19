---
description: Interactive workflow for adding a new top-level goal to the project roadmap
---

This workflow guides you through creating a new top-level development goal with proper documentation and roadmap integration.

## Process

1. **Gather Information** - Ask the user the following questions interactively:

   a. **Feature Name**: "What is the name of the new feature/goal?"
      - Use this to create a kebab-case filename (e.g., "Real-time Monitoring" → "real-time-monitoring.md")

   b. **Top-Level Goal**: "What is the brief, high-level objective? (1-2 sentences)"

   c. **Problem Statement**: "What problem does this feature solve? What user requirements does it address?"

   d. **Expected Outcomes**: "What are the expected outcomes when this feature is complete?"

   e. **Technical Approach** (optional): "Do you have any initial thoughts on the technical approach or architecture?"

   f. **Dependencies** (optional): "Does this feature depend on any existing features or infrastructure?"

   g. **Priority** (optional): "Should this be added at a specific position in the roadmap, or at the end?"

2. **Create Planning Document**:

   Create a new file in `planning/<feature-name>.md` with the following structure:

   ```markdown
   # <Feature Name>

   ## Top-Level Goal

   <Brief objective from step 1b>

   ## Detailed Goal

   ### Problem Statement
   <Answer from step 1c>

   ### Expected Outcomes
   <Answer from step 1d>

   ## Implementation Plan

   <!-- To be filled in during implementation planning phase -->
   1. Task breakdown pending

   ## Technical Considerations

   <Answer from step 1e if provided, otherwise leave placeholder>

   ## Acceptance Criteria

   <!-- To be defined during planning phase -->
   - [ ] Criterion 1
   - [ ] Criterion 2

   ## Dependencies & Prerequisites

   <Answer from step 1f if provided, otherwise "None identified">

   ## Notes

   Created: <current date>
   Status: Planning
   ```

3. **Update Roadmap**:

   Add a new entry to `planning/roadmap.md` in the "Upcoming features" section:

   ```markdown
   - [ ] [<Feature Name>](<feature-name>.md) - <Brief description>
   ```

   Insert at the position specified in step 1g, or append to the end of the list if no position was specified.

4. **Confirm Completion**:

   Show the user:
   - The path to the new planning document
   - The updated roadmap section
   - A reminder that they can now fill in additional details in the planning document

## Example Usage

**User**: "I want to add a new goal for real-time experiment monitoring"

**Agent**: Proceeds through questions 1a-1g, then creates `planning/real-time-monitoring.md` and updates `planning/roadmap.md`.

## Notes

- Keep questions conversational and allow the user to skip optional questions
- If the user provides minimal information, create the planning document with placeholders
- Ensure the roadmap entry is concise (one line) - detailed info goes in the planning document
- Use kebab-case for filenames (lowercase, hyphens for spaces)
