---
description: Steps for testing the frontend after making significant changes
---

After making big frontend changes, testing should be done by following these steps:

1. **Check for build errors**: Run the production build to ensure there are no compilation or bundling issues.
   ```bash
   npm run build
   ```

2. **Run a local dev server**: Start the frontend development server to test changes interactively.
   You may also need to start the backend server. See the main readme for commands for both of these.

3. **Verify in the browser**:
   - Open the application in the **Chrome browser**.
   - Check the overall look and feel.
   - Open the Developer Tools (F12) to check for any runtime errors in the console.
