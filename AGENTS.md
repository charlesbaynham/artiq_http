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

<<<<<<< HEAD
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

The mock serves a live 0D repeat single-point NDScan (`ndscan.rid_1`) with four channels (Signal A–D) updating every 0.5 s, so the Plots view has data to render immediately. It also serves five animated camera images of differing sizes and patterns (`camera_image`, `mot_fluorescence_image`, `ion_chain_image`, `background_image`, `absorption_image`), so the Plots image view can be exercised with multiple images at once. Schedule is empty; experiment submission and cancellation return 503. No ARTIQ stack or Docker is required.

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

> **TODO:** `userConfig` in the `.claude-plugin/plugin.json` is temporarily hard-coded to `https://artiq.baynham.me/mcp` because `userConfig` support is broken pending https://github.com/anthropics/claude-code/issues/39827. Future agent runs should check whether that issue is resolved before reintroducing `userConfig`.

This project includes agent configuration in the `.agent/` directory:
- `.agent/settings.local.json` - Permissions and auto-approval settings
- `.agent/workflows/` - Reusable workflow definitions
- `.agent/skills/` - Custom agent skills
- `.agent/agents/` - Agent-specific configurations

## Versioning

This project uses manual semantic versioning with hard-coded version strings. The version is stored in both:
- `artiq_http/__init__.py` - Runtime package version (`__version__`)
- `pyproject.toml` - Packaging metadata version

**When making changes, update the version according to Semantic Versioning (semver) principles:**
- **MAJOR** (X.0.0): Breaking changes to the API
- **MINOR** (0.X.0): New features, backward-compatible
- **PATCH** (0.0.X): Bug fixes, backward-compatible

**Update both files whenever you make changes:**
1. Determine the appropriate version increment based on the changes
2. Update `artiq_http/__init__.py` (`__version__`)
3. Update the `version` field in `pyproject.toml` to match

## Agent documentation

- Whenever changes are made, review the agent guidance and update it if required
- Always include screenshots in PRs for frontend changes
