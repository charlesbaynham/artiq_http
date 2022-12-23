artiq_http
==========

**A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API**

*Charles Baynham 2022*

A work in progress...

Usage
-----

* Setup an environment: `nix develop` then `cd frontend && npm install`
* Run a development server: `npm run dev`
* Recompile the static HTML: `npm run build`
* Run the server in production mode: `aqctl_artiq_http`

Authors
-------

`artiq_http` was written by `Charles Baynham <charles.baynham@gmail.com>`_.

The `pypackage template <https://gitlab.com/aion-physics/code/pypackage-template>`_ from which this package was generated was written by Charles Baynham and inspired by `cookiecutter-pypackage-minimal <https://github.com/kragniz/cookiecutter-pypackage-minimal>`_
