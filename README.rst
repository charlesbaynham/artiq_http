artiq_http
==========

**A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API**

*Charles Baynham 2022*

A work in progress...

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

    # Run frontend development server in one shell
    cd frontend && npm run start

    # Run the backend in another shell
    uv run aqctl_artiq_http

**Local Test Environment:**

A local ARTIQ master can be run using Docker for testing without a real physical ARTIQ master. This includes ``ndscan`` and some example experiments.

.. code-block:: bash

    # Start the local ARTIQ master
    cd test-artiq
    docker compose up -d

    # The master will be available on the default ARTIQ ports (3250-3251)
    # The default configuration in artiq_http is set to use 127.0.0.1

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

.. code-block:: bash

    # Build static HTML first
    cd frontend && npm run build

    # Install production dependencies only
    uv sync --no-dev

    # Run the server (default port 8000)
    uv run aqctl_artiq_http

    # Run on a custom port
    uv run aqctl_artiq_http --port 8080

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
