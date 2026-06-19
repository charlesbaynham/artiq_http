=====
Usage
=====

------
Basics
------

The ``artiq_http`` server exposes ARTIQ functionality as a RESTful HTTP API.
Start the server and point your client at ``http://<host>:8000``.

----------------
Experiment scans
----------------

For ndscan experiments you have two submission paths.

High-level scan submission (recommended)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use ``POST /api/scan`` when you want the server to build the ``ndscan_params``
for you.  Supply axes and optional fixed-parameter overrides; the server
validates the request against the live experiment schema and then submits.

Example — 1-D linear scan::

    POST /api/scan
    {
      "file": "scans/rabi.py",
      "class_name": "RabiFlop",
      "axes": [
        {
          "fqn": "rabi.pulse_duration",
          "type": "LinearScan",
          "range": {"start": 1e-6, "stop": 100e-6, "num_points": 50}
        }
      ],
      "fixed_params": {"rabi.amplitude": 0.5},
      "num_repeats": 3
    }

Valid ``type`` values: ``LinearScan``, ``RandomScan``, ``ExpScan``, ``ListScan``.

For ``LinearScan`` / ``RandomScan`` / ``ExpScan`` the ``range`` dict must
contain ``start`` (float), ``stop`` (float), and ``num_points`` (int).
``start`` must be strictly less than ``stop``; ``num_points`` must be ≥ 1.

For ``ListScan`` the ``range`` dict must contain ``values`` (non-empty list
of floats).

All values must be in SI units as declared by the experiment parameter schema.

A parameter must not appear in both ``axes`` and ``fixed_params``; the server
returns HTTP 422 if an overlap is detected.

Scanning an experiment by ref
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To scan an experiment that exists only on another branch (i.e. not on the
master's current revision), add an optional ``repo_rev`` field (a commit hash,
branch, or tag).  The server re-examines the experiment at that revision — the
same mechanism behind the dashboard's "Recompute all arguments" — builds the
``ndscan_params`` from *that* revision's arguments, validates against them, and
sets ``repo_rev`` on the submitted experiment so the master checks the revision
out before running.  This removes the need to hand-build ``ndscan_params`` and
submit via ``POST /api/schedule`` just to run a scan by ref. Omit ``repo_rev``
to use the master's current revision (the default).

By default ``POST /api/scan`` returns the integer Run ID (RID) as soon as the
experiment is queued.  To block until the experiment finishes, add the
``wait_for_completion=true`` query parameter.  When waiting, the endpoint
returns a result object (``rid``, ``status`` — one of ``completed`` /
``failed`` / ``timeout`` —, ``timed_out``, and ``error``) instead of a bare
RID.  An optional ``timeout`` query parameter sets the maximum wait in seconds
(default 600, capped at 21600).  The same ``wait_for_completion`` / ``timeout``
parameters are accepted by ``POST /api/schedule``.

Error codes
^^^^^^^^^^^

* ``404`` — experiment not found in the explist.
* ``422`` — validation failure (invalid scan type, unknown FQN, range error,
  axis/fixed overlap, non-ndscan experiment, etc.).  The ``detail`` field
  contains a human-readable message.

Raw submission with ndscan_params
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Existing clients that build ``ndscan_params`` themselves can continue to use
``POST /api/schedule``.  The server validates ``ndscan_params`` before
forwarding to ARTIQ and returns HTTP 422 for malformed payloads.

MCP tools
~~~~~~~~~

The MCP server exposes two high-level scan tools:

* ``submit_1d_scan`` — single-axis scan; takes ``axis_fqn``, ``scan_type``,
  and ``scan_range`` directly.
* ``submit_multi_axis_scan`` — multi-axis scan; takes an ``axes`` list in the
  same format as ``POST /api/scan``.

Both tools call ``POST /api/scan`` internally and return the RID.  Like the
``submit_experiment`` tool, they accept ``wait_for_completion`` (default
``False``) and ``timeout_seconds`` (default 600, capped at 21600); when waiting
they return a result dict (``rid``, ``status``, ``timed_out``, ``error``)
instead of a bare RID.  Both also accept an optional ``repo_rev`` to scan an
experiment by ref (see "Scanning an experiment by ref" above).
