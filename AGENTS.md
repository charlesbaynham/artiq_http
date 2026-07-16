# artiq_http

A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API

## Project Overview

- **Tech Stack:** Python/FastAPI
- **Database:** None
- **Dev Environment:** Local (uv)

## Note

**CLAUDE.md is a symlink to this file.** When making changes, edit AGENTS.md directly.

## Quick Start

See README.rst for instructions

## Project Structure

- `artiq_http/` - Main Python package
  - `api.py` - FastAPI application
  - `main.py` - Entry point
  - `config.py` - Configuration
  - `artiq_api/` - ARTIQ API wrapper modules
- `mcp_server/` - MCP (Model Context Protocol) server (`server.py`) that bridges to the HTTP API
- `frontend/` - React frontend
- `docker/` - Container and compose configuration for backend/frontend deployment
  - `compose.yml` - Main backend/frontend compose stack
  - `compose.localtesting.yml` - Local ARTIQ test stack override
  - `compose.watchtower.yml` - Watchtower auto-update override
  - `Dockerfile.backend` - Backend image definition
  - `Dockerfile.frontend` - Frontend image definition
  - `Caddyfile` - Frontend reverse-proxy/static serving config
- `test-artiq/` - Local ARTIQ test environment (Docker). This directory mimics the structure of an external ARTIQ experiment repository for testing purposes, but is a subdirectory of this project.
  - `repository/` - Minimal experiments for testing. This folder represents the root of the "mock" ARTIQ repository. Note that it is not a git repository, despite the name.
  - `flake.nix` - Nix flake that builds the ARTIQ + ndscan Docker image
  - `docker-compose.yml` - Test stack orchestration
- `tests/` - Test suite
- `docs/` - Sphinx documentation

## Configuration

`artiq_http/config.py` reads settings from environment variables (e.g. via a `.env`
file loaded by the process manager, or `docker/compose.yml`):

- `ARTIQ_HTTP_HOST`, `ARTIQ_HTTP_PORT_NOTIFIERS`, `ARTIQ_HTTP_PORT_CLIENTS`,
  `ARTIQ_HTTP_PORT_BROADCAST` - ARTIQ master connection details
- `ARTIQ_HTTP_OLD_ARTIQ_SUPPORT` - compatibility toggle for older ARTIQ versions
- `ARTIQ_HTTP_MOCK` - run against the mock backend instead of a real ARTIQ master
- `ARTIQ_HTTP_DEFAULT_REVISION` - git revision/branch the GUI's "Rev / ref" field
  falls back to when left blank and no lab-wide default revision is set (see
  `DefaultRevision.jsx`). Empty (default) preserves the historic behaviour of
  falling back to the master's current revision (`current_rev`); set it to e.g.
  `master` to instead always target that ref regardless of whichever revision the
  ARTIQ master currently has checked out. Exposed to the frontend as
  `default_revision_fallback` on `GET /api/explist`.

## MCP Server

`mcp_server/server.py` is a hand-written [FastMCP](https://github.com/modelcontextprotocol/python-sdk)
server that exposes ARTIQ functionality to MCP clients (e.g. Claude). It is a
thin, curated bridge: every tool simply calls the FastAPI HTTP backend
(`artiq_http/api.py`) over HTTP via `httpx`. It is deliberately *not*
auto-generated from the OpenAPI schema — the hand-written layer adds
LLM-friendly docstrings, flattened parameters, response unwrapping (e.g.
datasets), convenience scan tools, and prompts/resources that have no HTTP
equivalent.

**Feature-parity rule:** because the two interfaces are maintained separately,
any change to the HTTP API surface MUST be mirrored in the MCP server. In
particular:

- A new request parameter on `POST /api/schedule` (the `ExpID` body or its query
  params) must be added to the `submit_experiment` tool.
- A new request parameter on `POST /api/scan` (`ScanSubmitRequest`) must be added
  to the `submit_1d_scan` and `submit_multi_axis_scan` tools.
- A new HTTP endpoint that an MCP client could reasonably use should get a
  corresponding tool.

`submit_batch` is an MCP-only convenience: it fans out over a list of
`variants` (each with its own `fixed_params`) and submits one scan per variant
by reusing the existing `POST /api/scan` path — there is no dedicated batch HTTP
endpoint, so this is not a parity gap. Priority is deliberately batch-wide (a
single value for the whole call, never per-variant) so a negative-priority queue
floor stays satisfied in one place; keep it that way. It exists so agents submit
many near-identical runs in one gated MCP call rather than bypassing the safety
gate with a hand-rolled REST loop.

The following HTTP features are intentionally **not** exposed via MCP (do not
treat these as parity gaps): `GET /api/datasets` full dump (too large — use the
`list_dataset_names` / `get_dataset_values` tools instead), `GET /api/datasets/stream/...`
(SSE streaming, not MCP-shaped), the `fields`/`full` query filters on the
`explist` endpoints (MCP returns the curated form), and `GET /api/` (hello-world).

**Compact-by-default rule:** the listing tools return trimmed payloads so an
agent is not flooded by bulk it rarely needs (chiefly a running ndscan scan's
full `ndscan_params` schemata, which ride along in the schedule item's expid).
`get_schedule` / `get_schedule_item` drop the bulky expid arguments (keeping
`file`, `class_name`, `repo_rev`, an `is_scan` flag and any non-ndscan
`argument_keys`); `list_experiments` / `search_experiments` trim each entry to
identity plus a one-line docstring `summary`. Each tool takes `verbose=True` to
restore the full payload, and the per-experiment tools
(`get_experiment_defaults`, `get_experiment_arginfo`,
`recompute_experiment_arguments`) remain the way to pull full detail for a
single experiment. Preserve this default when adding or changing listing tools:
new bulky fields belong behind `verbose`, not in the default response.

## Development Guidelines

- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write tests for new functionality
- Use uv for dependency management
- Run `ruff check` before committing
- Always run unit tests after making changes and fix issues before finishing
- If on the master branch, be sparing with commits - one per feature
- If on any other branch, use commits liberally. They will be squashed before merging
- When making multi-step changes on development branches, you should automatically make a commit after each step without prompting the user

## Mock Backend (Frontend Development)

For frontend work that doesn't need a real ARTIQ master, prefer the Makefile entry point:

```bash
make mock
```

This runs `./dev.sh --mock`, which skips the local ARTIQ Docker stack and starts the backend with `--mock`.

If you only need the backend process without the tmux dev environment, you can still run:

```bash
uv run python -m artiq_http.main --mock
# or: ARTIQ_HTTP_MOCK=1 uv run python -m artiq_http.main
```

The mock serves a live 0D repeat single-point NDScan (`ndscan.rid_1`) with four channels (Signal A–D) updating every 0.5 s, so the Plots view has data to render immediately. It also serves two 1D frequency-scan NDScans of the same experiment (`mock.MockFreqScan`): a completed run (`ndscan.rid_2`) that can be toggled on as a ghost overlay, and a live run (`ndscan.rid_3`) whose points stream in a randomized order with repeats at each x. The live run exercises the Plot1D line rendering, which sorts points by their scanned-axis value and draws the connecting line through the per-x mean with standard-error-of-the-mean error bars. The 1D scan has three channels — two small-scale 0–1 channels (`signal`, `reference`) and one large-scale (`atom_number`, ~10⁴–10⁵) — with no display hints, so it also exercises the Plots view's channel grouping: channels are split into separate stacked plots (each with its own y-scale) by order-of-magnitude of their values (similar scales share a plot; only very different scales split), so `atom_number` renders on its own plot rather than crushing the 0–1 channels flat. Explicit ndscan `share_axis_with` hints are still honoured, but only to *force* channels onto a shared axis — they never split otherwise-similar channels apart. It also serves five animated camera images of differing sizes and patterns (`camera_image`, `mot_fluorescence_image`, `ion_chain_image`, `background_image`, `absorption_image`), so the Plots image view can be exercised with multiple images at once. Schedule is empty; experiment submission and cancellation return 503. No ARTIQ stack or Docker is required.

The mock backend lives in `artiq_http/mock_backend.py`. It replaces the global `subscriber_manager` singleton at startup, so all API paths behave normally.

## Reference repos

This projects relies on interfacing with the ARTIQ and ndscan packages, even though they are not direct dependencies. To facilitate development, this project includes reference clones of both packages in `.claude/deps/` (updated by a Claude Code hook on startup). These are read-only and should be consulted for reference only.

## Local ARTIQ Testing

After any major change to the backend or experiment discovery logic, you **must** verify the changes against the local ARTIQ test environment:

1. Build and load the local test image: `cd test-artiq && nix build .#docker --accept-flake-config && docker load < result`
2. Start the local master: `cd test-artiq && docker compose up -d`
3. Verify connectivity: `uv run sipyco_rpctool 127.0.0.1 3251 list-targets`
4. Check logs for experiment discovery errors: `docker compose logs artiq-master`

To run the local real-server test suite end to end:

```bash
cd test-artiq
nix build .#docker --accept-flake-config
docker load < result
docker compose up -d
cd ..
uv run pytest --realserver
```

See `test-artiq/README.md` (or the walkthrough) for more details.

## Testing

To run the unit tests, use the following commands:

```bash
# Run basic tests
uv run pytest

# Run all tests, including those requiring a real ARTIQ stack (Docker)
uv run pytest --realserver

# Run with coverage
uv run coverage run -m pytest --realserver
uv run coverage report
```

## Agent Configuration

> **TODO:** `userConfig` in the `.claude-plugin/plugin.json` is temporarily hard-coded to `https://artiq.stronlab.net/mcp` because `userConfig` support is broken pending https://github.com/anthropics/claude-code/issues/39827. Future agent runs should check whether that issue is resolved before reintroducing `userConfig`.

This project includes agent configuration in the `.agent/` directory:
- `.agent/settings.local.json` - Permissions and auto-approval settings
- `.agent/workflows/` - Reusable workflow definitions
- `.agent/skills/` - Custom agent skills
- `.agent/agents/` - Agent-specific configurations

## Versioning

This project uses manual semantic versioning with hard-coded version strings. The version is stored in four places, which must stay in sync (enforced by `tests/test_version_consistency.py`):
- `artiq_http/__init__.py` - Runtime package version (`__version__`)
- `pyproject.toml` - Packaging metadata version
- `package.json` - Node/JS package version
- `.claude-plugin/plugin.json` - Claude plugin version

**When making changes, update the version according to Semantic Versioning (semver) principles:**
- **MAJOR** (X.0.0): Breaking changes to the API
- **MINOR** (0.X.0): New features, backward-compatible
- **PATCH** (0.0.X): Bug fixes, backward-compatible

**Update all four files whenever you make changes:**
1. Determine the appropriate version increment based on the changes
2. Update the `version` in `artiq_http/__init__.py`, `pyproject.toml`,
   `package.json`, and `.claude-plugin/plugin.json` so they all match

## Agent documentation

- Whenever changes are made, review the agent guidance and update it if required
- Whenever you make frontend changes, show screenshots of the result directly in the chat
