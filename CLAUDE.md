# ARTIQ HTTP — Claude Guidelines

## Project Overview

ARTIQ HTTP is a FastAPI-based REST API for the ARTIQ quantum control system. It exposes ARTIQ's experiment scheduling, device management, and dataset access via HTTP.

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, Pydantic, uvicorn
- **Frontend**: React (in `frontend/`)
- **Package Management**: Poetry (migrating to UV)
- **Testing**: pytest, with real ARTIQ master in Docker for integration tests
- **Docs**: Sphinx

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `artiq_http/` | Main Python package |
| `artiq_http/artiq_api/` | ARTIQ integration layer |
| `frontend/` | React SPA |
| `sdk/` | Python client SDK (`artiq_http_client`) |
| `test-artiq/` | Docker-based local ARTIQ master for testing |
| `tests/` | pytest suite |

## When Reviewing Code

- Check FastAPI endpoint signatures match OpenAPI spec in `fern/openapi/openapi.json`
- Verify SSE endpoints handle connection cleanup properly
- Ensure numpy types are handled via `NumpyJSONResponse`
- Check that persistent subscriber changes handle reconnection
- For frontend: verify React hooks clean up on unmount
- Tests should cover both mock and real-server (`--realserver`) scenarios
