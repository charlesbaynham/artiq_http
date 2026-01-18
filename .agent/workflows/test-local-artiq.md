---
description: Verify the backend against a local ARTIQ master using Docker
---

To verify changes against a local ARTIQ master:

1. **Start the local ARTIQ master**:
   ```bash
   cd test-artiq
   docker compose up -d
   ```

   **For development with auto-reload on file changes**:
   ```bash
   cd test-artiq
   docker compose watch
   ```
   This will automatically restart the ARTIQ master when you modify experiments in `repository/` or `device_db.py`. Press Ctrl+C to stop watch mode.

2. **Wait for the master to initialize** (usually ~5-10 seconds).

3. **Verify connectivity and discovery**:
   // turbo
   ```bash
   poetry run sipyco_rpctool 127.0.0.1 3251 list-targets
   ```

4. **Check master logs for experiment discovery errors**:
   // turbo
   ```bash
   docker compose logs artiq-master
   ```

   Ensure that `simple_exp.py` and `ndscan_exp.py` are processed without `ERROR` or `TypeError`.

5. **Stop the stack when finished**:
   ```bash
   docker compose down
   ```
