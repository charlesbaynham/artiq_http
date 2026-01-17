artiq_http
==========

**A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API**

*Charles Baynham 2022*

A work in progress...

Installation
------------

Install Poetry if not already installed:

.. code-block:: bash

    curl -sSL https://install.python-poetry.org | python3 -

Install dependencies:

.. code-block:: bash

    poetry install
    cd frontend && npm install

Usage
-----

**Development:**

.. code-block:: bash

    # Run frontend development server in one shell
    cd frontend && npm run start

    # Run the backend in another shell
    poetry run aqctl_artiq_http

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
    poetry run pytest

    # Run with coverage
    poetry run coverage run -m pytest
    poetry run coverage report

    # Linting and formatting
    poetry run ruff check .
    poetry run ruff format .

    # Pre-commit hooks
    poetry run pre-commit run --all

**Production:**

.. code-block:: bash

    # Build static HTML first
    cd frontend && npm run build

    # Install production dependencies only
    poetry install --without dev

    # Run the server (default port 8000)
    poetry run aqctl_artiq_http

    # Run on a custom port
    poetry run aqctl_artiq_http --port 8080

**Documentation:**

.. code-block:: bash

    # Build HTML docs
    poetry run sphinx-apidoc -o docs/autogen artiq_http
    poetry run sphinx-build docs html_out -b html

    # Build with auto-reload
    poetry run sphinx-autobuild docs html_out

Authors
-------

`artiq_http` was written by `Charles Baynham <charles.baynham@gmail.com>`_.

The `pypackage template <https://gitlab.com/aion-physics/code/pypackage-template>`_ from which this package was generated was written by Charles Baynham and inspired by `cookiecutter-pypackage-minimal <https://github.com/kragniz/cookiecutter-pypackage-minimal>`_
