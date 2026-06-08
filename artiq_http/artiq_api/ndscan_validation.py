"""Validate ndscan_params before experiment submission.

Simple, stateless validation functions.  No classes, no inheritance — just
plain functions that return an error string or None.

This validates ndscan's *real* decoded wire format (the same one
``ndscan.experiment.entry_point`` consumes), not an invented schema:

* ``ndscan_params`` is the PYON/JSON string value of the argument (we also
  tolerate the ``[spec, None, None]`` arginfo triple for convenience).
* ``scan.axes[i]`` uses an ndscan generator name and carries a ``path``.
* ``overrides`` maps ``fqn -> [{"path": ..., "value": ...}]``.
"""

from __future__ import annotations

import json
from typing import Any

# ndscan scan-generator names the high-level scan API supports
# (see ndscan.experiment.scan_generator.GENERATORS).
VALID_SCAN_TYPES = {"linear", "centre_span", "list"}

# Required range keys per generator (besides the common, defaulted
# ``randomise_order``).
_RANGE_KEYS = {
    "linear": ("start", "stop", "num_points"),
    "centre_span": ("centre", "half_span", "num_points"),
    "list": ("values",),
}


def _get_ndscan_json(arguments: dict) -> tuple[str | None, str | None]:
    """Extract the raw ndscan_params JSON string from *arguments*.

    Accepts either the argument *value* (a PYON/JSON string, the normal case) or
    the arginfo descriptor triple ``[{"default": <str>}, None, None]``.

    Returns (json_string, error_string).  Exactly one of the two is non-None,
    except when ndscan_params is absent (both None).
    """
    ndscan_params = arguments.get("ndscan_params")
    if ndscan_params is None:
        return None, None
    if isinstance(ndscan_params, str):
        return ndscan_params, None
    # Tolerate the arginfo-style triple [{..., "default": <json str>}, None, None]
    if isinstance(ndscan_params, (list, tuple)) and ndscan_params:
        spec = ndscan_params[0]
        if isinstance(spec, dict):
            default_json = spec.get("default")
            if isinstance(default_json, str):
                return default_json, None
    return None, "ndscan_params must be a PYON/JSON string (or [spec, None, None] triple)"


def _fqn_exists(fqn: str, schemata: dict) -> bool:
    """Check whether *fqn* is defined in the ndscan schemata."""
    return fqn in schemata and isinstance(schemata[fqn], dict)


def _validate_axis(axis: dict, canonical_fqns: set, axis_idx: int) -> str | None:
    """Validate a single scan axis in ndscan wire format.  Return error or None."""
    if not isinstance(axis, dict):
        return f"scan.axes[{axis_idx}] is not a dict"

    fqn = axis.get("fqn")
    if not fqn or not isinstance(fqn, str):
        return f"scan.axes[{axis_idx}]: missing or invalid 'fqn'"

    if canonical_fqns and fqn not in canonical_fqns:
        return f"scan.axes[{axis_idx}]: unknown parameter '{fqn}'"

    if "path" not in axis:
        return f"scan.axes[{axis_idx}]: missing 'path'"

    scan_type = axis.get("type")
    if not scan_type or scan_type not in VALID_SCAN_TYPES:
        return (
            f"scan.axes[{axis_idx}]: invalid scan type '{scan_type}'. "
            f"Must be one of: {', '.join(sorted(VALID_SCAN_TYPES))}"
        )

    range_data = axis.get("range")
    if not isinstance(range_data, dict):
        return f"scan.axes[{axis_idx}]: missing or invalid 'range'"

    missing = [k for k in _RANGE_KEYS[scan_type] if k not in range_data]
    if missing:
        return f"scan.axes[{axis_idx}]: range missing {', '.join(missing)}"

    if scan_type == "list":
        values = range_data.get("values")
        if not isinstance(values, list) or len(values) == 0:
            return f"scan.axes[{axis_idx}]: list scan requires a non-empty 'values' list"
        return None

    # linear / centre_span: numeric range with a positive point count.
    try:
        num_points = int(range_data["num_points"])
        for k in _RANGE_KEYS[scan_type][:-1]:  # the numeric endpoints/centre/span
            float(range_data[k])
    except (ValueError, TypeError):
        return f"scan.axes[{axis_idx}]: range values must be numeric"

    if num_points <= 0:
        return f"scan.axes[{axis_idx}]: num_points ({num_points}) must be greater than 0"
    if scan_type == "linear" and num_points < 2:
        return f"scan.axes[{axis_idx}]: linear scan needs num_points >= 2"
    if scan_type == "linear" and float(range_data["start"]) == float(range_data["stop"]):
        return f"scan.axes[{axis_idx}]: linear scan start and stop must differ"

    return None


def _validate_overrides(overrides: Any) -> str | None:
    """Validate the ``overrides`` mapping: {fqn: [{"path","value"}, ...]}."""
    if not isinstance(overrides, dict):
        return "ndscan_params 'overrides' must be a dict"
    for fqn, specs in overrides.items():
        if not isinstance(specs, list) or not specs:
            return f"override for '{fqn}' must be a non-empty list of path/value specs"
        for spec in specs:
            if not isinstance(spec, dict) or "path" not in spec or "value" not in spec:
                return f"override for '{fqn}' must contain dicts with 'path' and 'value'"
    return None


def validate_ndscan_params(arguments: dict, arginfo: dict | None) -> str | None:
    """Validate ndscan_params inside *arguments* against *arginfo*.

    Args:
        arguments: The ``expid.arguments`` dict, which may contain
            ``ndscan_params`` (as the PYON/JSON string value).
        arginfo: The experiment's arginfo from the explist.  Used to look up the
            canonical ndscan schemata so we can verify FQNs.

    Returns:
        An error string if validation fails, or ``None`` if the params are valid
        (or no ndscan_params are present).
    """
    json_string, error = _get_ndscan_json(arguments)
    if error:
        return error
    if json_string is None:
        return None

    try:
        params_data: dict[str, Any] = json.loads(json_string)
    except json.JSONDecodeError as e:
        return f"ndscan_params JSON parse error: {e}"

    if not isinstance(params_data, dict):
        return "ndscan_params JSON must parse to a dict"

    if "scan" not in params_data:
        return "ndscan_params missing required key 'scan'"

    scan = params_data.get("scan", {})
    if not isinstance(scan, dict):
        return "ndscan_params 'scan' must be a dict"

    axes = scan.get("axes", [])
    if not isinstance(axes, list):
        return "ndscan_params 'scan.axes' must be a list"

    canonical_fqns: set[str] = set()
    if arginfo is not None:
        canonical_fqns = set(_extract_schemata_from_arginfo(arginfo).keys())

    scanned_fqns: set[str] = set()
    for idx, axis in enumerate(axes):
        err = _validate_axis(axis, canonical_fqns, idx)
        if err:
            return err
        scanned_fqns.add(axis["fqn"])

    overrides = params_data.get("overrides", {})
    err = _validate_overrides(overrides)
    if err:
        return err

    # Overridden FQNs must exist, and must not also be scanned.
    for fqn in overrides:
        if canonical_fqns and fqn not in canonical_fqns:
            return f"override references unknown parameter '{fqn}'"
        if fqn in scanned_fqns:
            return f"parameter '{fqn}' is both scanned and fixed (in overrides)"

    num_repeats = scan.get("num_repeats", 1)
    if not isinstance(num_repeats, int) or num_repeats < 1:
        return f"scan.num_repeats ({num_repeats}) must be an integer >= 1"

    return None


def _extract_schemata_from_arginfo(arginfo: dict) -> dict:
    """Extract the ndscan schemata dict from an experiment's arginfo.

    Returns an empty dict if ndscan_params is missing or malformed.
    """
    ndscan_params = arginfo.get("ndscan_params")
    if not ndscan_params or not isinstance(ndscan_params, (list, tuple)):
        return {}

    try:
        spec = ndscan_params[0]
        if not isinstance(spec, dict):
            return {}
        default_json = spec.get("default")
        if not default_json or not isinstance(default_json, str):
            return {}
        params_data = json.loads(default_json)
        schemata = params_data.get("schemata", {})
        if isinstance(schemata, dict):
            return schemata
    except (json.JSONDecodeError, IndexError, KeyError, TypeError):
        pass
    return {}
