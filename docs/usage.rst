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

Use ``POST /api/scan/submit-and-wait`` to block until the experiment finishes.
This endpoint accepts the same body plus an optional ``timeout`` query
parameter (seconds, capped at 300).

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

Both tools call ``POST /api/scan`` internally and return the RID.
