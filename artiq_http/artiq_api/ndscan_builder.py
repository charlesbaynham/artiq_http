"""Build canonical ndscan_params from high-level scan input.

Simple, stateless builder.  No classes — just plain functions.
"""

from __future__ import annotations

import json
from typing import Any

from .ndscan_validation import _extract_schemata_from_arginfo
from .notifiers import get_explist


async def build_ndscan_params(
    file: str,
    class_name: str,
    axes: list[dict],
    fixed_params: dict[str, Any] | None = None,
    num_repeats: int = 1,
) -> list:
    """Build canonical ndscan_params from high-level scan input.

    Fetches the experiment's arginfo from the explist, extracts the canonical
    schemata, and assembles a complete ndscan_params dict in the ARTIQ
    list-of-dicts format.

    Args:
        file: Experiment file path (e.g. "scans/rabi.py").
        class_name: Experiment class name (e.g. "RabiFlop").
        axes: List of scan-axis dicts, each with ``fqn``, ``type``, and
            ``range`` keys.
        fixed_params: Dict mapping FQN to override value.  These become the
            ``overrides`` in ndscan_params.
        num_repeats: Number of repeat runs (default: 1).

    Returns:
        The ndscan_params in ARTIQ list-of-dicts format::

            [{"ty": "PYONValue", "default": json_string}, None, None]

    Raises:
        ValueError: If the experiment is not found in the explist, or if it
            does not have ndscan_params in its arginfo.
    """
    explist = await get_explist()

    arginfo = None
    for exp in explist.experiments:
        if exp.file == file and exp.class_name == class_name:
            arginfo = exp.arginfo
            break

    if arginfo is None:
        raise ValueError(f"Experiment {file}/{class_name} not found in explist")

    # Extract canonical schemata from arginfo
    schemata = _extract_schemata_from_arginfo(arginfo)
    if not schemata:
        raise ValueError(f"Experiment {file}/{class_name} has no ndscan schemata")

    # Extract instances and always_shown from the original ndscan_params
    instances: dict[str, list[str]] = {}
    always_shown: list = []

    ndscan_params_raw = arginfo.get("ndscan_params")
    if ndscan_params_raw and isinstance(ndscan_params_raw, (list, tuple)):
        try:
            spec = ndscan_params_raw[0]
            if isinstance(spec, dict):
                default_json = spec.get("default")
                if default_json and isinstance(default_json, str):
                    original_data = json.loads(default_json)
                    if isinstance(original_data, dict):
                        instances = original_data.get("instances", {})
                        always_shown = original_data.get("always_shown", [])
        except (json.JSONDecodeError, IndexError, KeyError, TypeError):
            pass

    # Build the ndscan_params dict
    params_data = {
        "instances": instances,
        "schemata": schemata,
        "always_shown": always_shown,
        "overrides": fixed_params or {},
        "scan": {
            "axes": axes,
            "num_repeats": num_repeats,
        },
    }

    return [
        {"ty": "PYONValue", "default": json.dumps(params_data)},
        None,
        None,
    ]
