# artiq_http

A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API

## Project Overview

- **Tech Stack:** Python/FastAPI
- **Database:** None
- **Dev Environment:** Local (Poetry)
- **Claude OS Directory:** /home/charles/repos/claude-os

## Quick Start

```bash
# Install dependencies
poetry install
cd frontend && npm install

# Run development server
cd frontend && npm run dev

# Run tests
poetry run pytest

# Linting
poetry run ruff check .
poetry run ruff format .
```

## Project Structure

- `artiq_http/` - Main Python package
  - `api.py` - FastAPI application
  - `main.py` - Entry point
  - `config.py` - Configuration
  - `artiq_api/` - ARTIQ API wrapper modules
- `frontend/` - React frontend
- `tests/` - Test suite
- `docs/` - Sphinx documentation

## Knowledge Bases

This project uses Claude OS with the following knowledge bases:
- `artiq_http-project_memories` - Decisions, patterns, and insights
- `artiq_http-project_profile` - Architecture and standards
- `artiq_http-project_index` - Code semantic index
- `artiq_http-knowledge_docs` - Project documentation

## Commands

Use `/claude-os-search` to search project memories and docs.
Use `/claude-os-save` to save insights and decisions.
Use `/claude-os-session` to manage development sessions.

## Development Guidelines

- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write tests for new functionality
- Use Poetry for dependency management
- Run `ruff check` before committing

## Testing

```bash
poetry run pytest
poetry run coverage run -m pytest
poetry run coverage report
```
