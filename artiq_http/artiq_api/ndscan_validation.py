"""Validate ndscan_params before experiment submission.

Simple, stateless validation functions.  No classes, no inheritance — just
plain functions that return an error string or None.
"""

from __future__ import annotations

import json
from typing import Any

VALID_SCAN_TYPES = {"LinearScan", "RandomScan", "ExpScan", "ListScan"}


def _get_ndscan_json(arguments: dict) -> tuple[str | None, str | None]:
    """Extract the raw ndscan_params JSON string from *arguments*.

    Returns (json_string, error_string).  Exactly one of the two is non-None.
    """
    ndscan_params = arguments.get("ndscan_params")
    if ndscan_params is None:
        return None, None
    if not isinstance(ndscan_params, (list, tuple)) or len(ndscan_params) == 0:
        return None, "ndscan_params must be a non-empty list"
    spec = ndscan_params[0]
    if not isinstance(spec, dict):
        return None, "ndscan_params[0] must be a dict"
    default_json = spec.get("default")
    if not default_json or not isinstance(default_json, str):
        return None, "ndscan_params[0] must contain a 'default' string"
    return default_json, None


def _fqn_exists(fqn: str, schemata: dict) -> bool:
    """Check whether *fqn* is defined in the ndscan schemata."""
    return fqn in schemata and isinstance(schemata[fqn], dict)


def _validate_axis(axis: dict, schemata: dict, axis_idx: int) -> str | None:
    """Validate a single scan axis.  Return error string or None."""
    if not isinstance(axis, dict):
        return f"scan.axes[{axis_idx}] is not a dict"

    fqn = axis.get("fqn")
    if not fqn or not isinstance(fqn, str):
        return f"scan.axes[{axis_idx}]: missing or invalid 'fqn'"

    if not _fqn_exists(fqn, schemata):
        return f"scan.axes[{axis_idx}]: unknown parameter '{fqn}'"

    scan_type = axis.get("type")
    if not scan_type or scan_type not in VALID_SCAN_TYPES:
        return (
            f"scan.axes[{axis_idx}]: invalid scan type '{scan_type}'. "
            f"Must be one of: {', '.join(sorted(VALID_SCAN_TYPES))}"
        )

    range_data = axis.get("range")
    if not isinstance(range_data, dict):
        return f"scan.axes[{axis_idx}]: missing or invalid 'range'"

    # ListScan uses 'values' instead of start/stop/num_points
    if scan_type == "ListScan":
        values = range_data.get("values")
        if not isinstance(values, list):
            return f"scan.axes[{axis_idx}]: ListScan requires 'range.values' list"
        if len(values) == 0:
            return f"scan.axes[{axis_idx}]: ListScan values must not be empty"
        return None

    # Numeric scans: start, stop, num_points
    start = range_data.get("start")
    stop = range_data.get("stop")
    num_points = range_data.get("num_points")

    if start is None:
        return f"scan.axes[{axis_idx}]: range missing 'start'"
    if stop is None:
        return f"scan.axes[{axis_idx}]: range missing 'stop'"
    if num_points is None:
        return f"scan.axes[{axis_idx}]: range missing 'num_points'"

    try:
        start_f = float(start)
        stop_f = float(stop)
        num_points_i = int(num_points)
    except (ValueError, TypeError):
        return f"scan.axes[{axis_idx}]: range values must be numeric"

    if start_f >= stop_f:
        return f"scan.axes[{axis_idx}]: start ({start_f}) must be less than stop ({stop_f})"
    if num_points_i <= 0:
        return f"scan.axes[{axis_idx}]: num_points ({num_points_i}) must be greater than 0"

    return None


def validate_ndscan_params(arguments: dict, arginfo: dict | None) -> str | None:
    """Validate ndscan_params inside *arguments* against *arginfo*.

    Args:
        arguments: The ``expid.arguments`` dict, which may contain
            ``ndscan_params`` in the ARTIQ list-of-dicts format.
        arginfo: The experiment's arginfo from the explist.  Used to look up
            the canonical ndscan schemata so we can verify FQNs.

    Returns:
        An error string if validation fails, or ``None`` if the params are
        valid (or no ndscan_params are present).
    """
    json_string, error = _get_ndscan_json(arguments)
    if error:
        return error
    if json_string is None:
        return None

    # Parse JSON
    try:
        params_data: dict[str, Any] = json.loads(json_string)
    except json.JSONDecodeError as e:
        return f"ndscan_params JSON parse error: {e}"

    if not isinstance(params_data, dict):
        return "ndscan_params JSON must parse to a dict"

    # Required top-level keys
    for key in ("instances", "schemata", "scan"):
        if key not in params_data:
            return f"ndscan_params missing required key '{key}'"

    schemata = params_data.get("schemata", {})
    if not isinstance(schemata, dict):
        return "ndscan_params 'schemata' must be a dict"

    # If arginfo is provided, cross-check against the canonical schemata
    canonical_fqns: set[str] = set()
    if arginfo is not None:
        canonical_schemata = _extract_schemata_from_arginfo(arginfo)
        canonical_fqns = set(canonical_schemata.keys())

    scan = params_data.get("scan", {})
    if not isinstance(scan, dict):
        return "ndscan_params 'scan' must be a dict"

    axes = scan.get("axes", [])
    if not isinstance(axes, list):
        return "ndscan_params 'scan.axes' must be a list"

    scanned_fqns: set[str] = set()
    for idx, axis in enumerate(axes):
        err = _validate_axis(axis, schemata, idx)
        if err:
            return err
        scanned_fqns.add(axis["fqn"])

    # Cross-check FQNs against canonical schemata if available
    if canonical_fqns:
        for fqn in scanned_fqns:
            if fqn not in canonical_fqns:
                return f"scan axis references unknown parameter '{fqn}' (not in experiment schemata)"

    # Check for overlap between scanned and fixed (override) parameters
    overrides = params_data.get("overrides", {})
    if not isinstance(overrides, dict):
        return "ndscan_params 'overrides' must be a dict"

    for fqn in scanned_fqns:
        if fqn in overrides:
            return f"parameter '{fqn}' is both scanned and fixed (in overrides)"

    # num_repeats sanity
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
