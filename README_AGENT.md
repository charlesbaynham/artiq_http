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
- `test-artiq/` - Local ARTIQ test environment (Docker)
  - `repository/` - Minimal experiments for testing
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

## Testing

```bash
poetry run pytest
poetry run coverage run -m pytest
poetry run coverage report
```

## Agent Configuration

This project includes agent configuration in the `.agent/` directory:
- `.agent/settings.local.json` - Permissions and auto-approval settings
- `.agent/workflows/` - Reusable workflow definitions
- `.agent/skills/` - Custom agent skills
- `.agent/agents/` - Agent-specific configurations

## Versioning

This project uses manual semantic versioning. The version is stored in both:
- `VERSION.json` - Primary source of truth
- `pyproject.toml` - Poetry configuration (must match VERSION.json)

**When making changes, update the version according to Semantic Versioning (semver) principles:**
- **MAJOR** (X.0.0): Breaking changes to the API
- **MINOR** (0.X.0): New features, backward-compatible
- **PATCH** (0.0.X): Bug fixes, backward-compatible

**Update both files whenever you make changes:**
1. Determine the appropriate version increment based on the changes
2. Update `VERSION.json`
3. Update the `version` field in `pyproject.toml` to match

## Agent documentation

- Whenever changes are made, review the agent guidance and update it if required
