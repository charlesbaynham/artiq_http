# artiq_http

A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API

## Project Overview

- **Tech Stack:** Python/FastAPI
- **Database:** None
- **Dev Environment:** Local (Poetry)

## Quick Start

See README.rst for instructions

## Project Structure

- `artiq_http/` - Main Python package
  - `api.py` - FastAPI application
  - `main.py` - Entry point
  - `config.py` - Configuration
  - `artiq_api/` - ARTIQ API wrapper modules
- `frontend/` - React frontend
- `.claude-plugin/` - Claude Code plugin manifest (`plugin.json`)
- `skills/` - Claude Code plugin skills
- `resources/` - Claude Code plugin bundled resources (including SDK artifacts)
- `scripts/update_claude_plugin_sdk_resources.sh` - Script invoked by npm workflow to rebuild/sync SDK artifacts into `resources/artiq-sdk/`
- `docker/` - Container and compose configuration for backend/frontend deployment
  - `compose.yml` - Main backend/frontend compose stack
  - `compose.localtesting.yml` - Local ARTIQ test stack override
  - `compose.watchtower.yml` - Watchtower auto-update override
  - `Dockerfile.backend` - Backend image definition
  - `Dockerfile.frontend` - Frontend image definition
  - `Caddyfile` - Frontend reverse-proxy/static serving config
- `test-artiq/` - Local ARTIQ test environment (Docker). This directory mimics the structure of an external ARTIQ experiment repository for testing purposes, but is a subdirectory of this project.
  - `repository/` - Minimal experiments for testing. This folder represents the root of the "mock" ARTIQ repository. Note that it is not a git repository, despite the name.
  - `Dockerfile` - ARTIQ + ndscan image
  - `docker-compose.yml` - Test stack orchestration
- `tests/` - Test suite
- `docs/` - Sphinx documentation

## Development Guidelines

- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write tests for new functionality
- Use Poetry for dependency management
- Run `ruff check` before committing
- Always run unit tests after making changes and fix issues before finishing
- If on the master branch, be sparing with commits - one per feature
- If on any other branch, use commits liberally. They will be squashed before merging
- When making multi-step changes on development branches, you should automatically make a commit after each step without prompting the user

## Local ARTIQ Testing

After any major change to the backend or experiment discovery logic, you **must** verify the changes against the local ARTIQ test environment:

1. Start the local master: `cd test-artiq && docker compose up -d`
2. Verify connectivity: `poetry run sipyco_rpctool 127.0.0.1 3251 list-targets`
3. Check logs for experiment discovery errors: `docker compose logs artiq-master`

See `test-artiq/README.md` (or the walkthrough) for more details.

## Testing

To run the unit tests, use the following commands:

```bash
# Run basic tests
poetry run pytest

# Run all tests, including those requiring a real ARTIQ stack (Docker)
poetry run pytest --realserver

# Run with coverage
poetry run coverage run -m pytest --realserver
poetry run coverage report
```

## Agent Configuration

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

For this repository, also keep `package.json` and `.claude-plugin/plugin.json` versions aligned because `tests/test_version_consistency.py` validates all four versions.

For plugin maintenance workflows, use npm entrypoints:
- `npm run plugin:version:sync` - sync `.claude-plugin/plugin.json` version to `package.json`
- `npm run plugin:sdk:sync` - sync plugin version, then rebuild/copy latest SDK artifacts to `resources/artiq-sdk/`

## Agent documentation

- Whenever changes are made, review the agent guidance and update it if required
