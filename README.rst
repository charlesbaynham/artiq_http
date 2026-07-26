artiq_http
==========

**A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API**

*Charles Baynham 2022*

A work in progress...

ndscan scan submission is supported via ``POST /api/scan`` and the MCP tools
``submit_1d_scan`` / ``submit_multi_axis_scan``.  See `docs/usage.rst` for
the full API contract, valid scan types, and error codes.

Installation
------------

Install uv if not already installed:

.. code-block:: bash

    curl -LsSf https://astral.sh/uv/install.sh | sh

Install dependencies:

.. code-block:: bash

    uv sync
    cd frontend && npm install

Usage
-----

**Development:**

.. code-block:: bash

    # Run the full tmux dev environment
    make dev

    # Run the same dev environment in mock mode (no local ARTIQ Docker stack)
    make mock

    # Run frontend development server in one shell
    cd frontend && npm run start

    # Run the backend in another shell
    uv run aqctl_artiq_http

    # Run only the backend in mock mode
    uv run aqctl_artiq_http --mock

**Local Test Environment:**

A local ARTIQ master can be run using Docker for testing without a real physical ARTIQ master. This includes ``ndscan`` and some example experiments.

.. code-block:: bash

    # Start the local ARTIQ master
    cd test-artiq
    nix build .#docker --accept-flake-config
    docker load < result
    docker compose up -d

    # The master will be available on the default ARTIQ ports (3250-3251)
    # The default configuration in artiq_http is set to use 127.0.0.1

**Running real-server tests locally:**

The ``--realserver`` test suite talks to that local ARTIQ master.

.. code-block:: bash

    cd test-artiq
    nix build .#docker --accept-flake-config
    docker load < result
    docker compose up -d
    cd ..
    uv run pytest --realserver

To inspect or reset the test stack:

.. code-block:: bash

    cd test-artiq
    docker compose logs artiq-master
    docker compose down -v

**Tests:**

.. code-block:: bash

    # Run Python tests
    uv run pytest

    # Run all tests including those requiring a real ARTIQ master (starts stack automatically)
    uv run pytest --realserver

    # Run with coverage
    uv run coverage run -m pytest --realserver
    uv run coverage report

    # Linting and formatting
    uv run ruff check .
    uv run ruff format .

    # Pre-commit hooks
    uv run pre-commit run --all

**Production:**

For production deployments use the Docker Compose stack in ``docker/``, which
runs the backend (API only), the frontend (built and served by Caddy), and the
MCP server together:

.. code-block:: bash

    cd docker
    docker compose up -d

The backend no longer serves the bundled frontend itself. To run just the API
server (e.g. behind your own reverse proxy that serves the frontend separately):

.. code-block:: bash

    # Install production dependencies only
    uv sync --no-dev

    # Run the API server (default port 8000)
    uv run aqctl_artiq_http

    # Run on a custom port
    uv run aqctl_artiq_http --port 8080

**Static demo (GitHub Pages, no backend):**

The redesigned frontend also builds as a fully static site with no Python backend at
all — a browser-side adapter (``frontend/src/api/mockAdapter.js``) answers every
``/api/*`` call from JSON fixtures generated from ``artiq_http/mock_backend.py``.

.. code-block:: bash

    # Regenerate the static fixtures after any mock_backend.py change
    uv run python scripts/generate_mock_fixtures.py
    uv run pytest tests/test_mock_fixtures.py   # fails if the fixtures are stale

    # Build the static demo
    cd frontend
    npm run build:mock                          # -> frontend/dist/

    # Serve it locally (no backend running)
    npx --yes http-server dist -p 4180

``.github/workflows/pages.yml`` deploys this to GitHub Pages using the
Actions-artifact mechanism. **Repo Settings → Pages → Source must be set to
"GitHub Actions"** (not "Deploy from a branch") for this to work. Only one
deployment can be live at a time: pushing to ``master`` deploys master (the resting
state), a manual ``workflow_dispatch`` run deploys whichever branch you pick, and
adding the ``deploy-pages`` label to a PR deploys that PR's head and comments the
preview link on it. See ``AGENTS.md`` ("Static Mock / GitHub Pages Demo") for the
full contract, including a known conflict with the docs' existing Pages deployment
in ``ci.yml`` that needs a decision from whoever owns that job.

**Documentation:**

.. code-block:: bash

    # Build HTML docs
    uv run sphinx-apidoc -o docs/autogen artiq_http
    uv run sphinx-build docs html_out -b html

    # Build with auto-reload
    uv run sphinx-autobuild docs html_out

Versioning
----------

Versioning is intentionally simple and uses hard-coded strings in three files that must match:

- ``artiq_http/__init__.py`` (``__version__``)
- ``pyproject.toml`` (``[project].version``)
- ``package.json`` (``version``)

When bumping versions, update all three values together.

Authors
-------

`artiq_http` was written by `Charles Baynham <charles.baynham@gmail.com>`_.

The `pypackage template <https://gitlab.com/aion-physics/code/pypackage-template>`_ from which this package was generated was written by Charles Baynham and inspired by `cookiecutter-pypackage-minimal <https://github.com/kragniz/cookiecutter-pypackage-minimal>`_
