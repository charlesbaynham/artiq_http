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

    # Run frontend development server
    cd frontend && npm run dev

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

    # Run the server
    poetry run aqctl_artiq_http

    # Or install and use directly
    poetry install
    aqctl_artiq_http

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
