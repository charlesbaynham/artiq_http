# Fern SDK

This directory contains the Fern configuration for generating the ARTIQ HTTP Python SDK.

## Re-generating the SDK

1. Update the API in `artiq_http/api.py`
2. Export the updated OpenAPI spec:
   ```bash
   uv run python -c "import json; from artiq_http.api import app; print(json.dumps(app.openapi()))" 2>/dev/null | grep -v '^Production mode' > fern/openapi/openapi.json
   ```
3. Generate the SDK:
   ```bash
   fern generate --group python-sdk
   ```

The generated SDK will be placed in `sdk/` at the project root.

## SDK Package

The generated SDK package is `artiq_http_client` with the main client class `ArtiqClient`.
