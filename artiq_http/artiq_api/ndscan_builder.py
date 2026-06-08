"""Build a canonical ndscan_params *argument value* from high-level scan input.

Simple, stateless builder.  No classes — just plain functions.

The output is the PYON/JSON string that is submitted as the value of the
``ndscan_params`` experiment argument.  ndscan declares that argument as a
``PYONValue``, so ARTIQ feeds the value straight into ``pyon.decode`` — meaning
the value MUST be the encoded string, not the ``[spec, None, None]`` arginfo
descriptor triple (that triple is how an argument is *described*, not how its
value is *supplied*).

Only ``overrides`` and ``scan`` are read from the params at run time
(``ndscan.experiment.entry_point.ArgumentInterface.make_override_stores`` /
``make_scan_spec``); the experiment's ``schemata``/``instances`` are rebuilt
from the fragment code, so we deliberately emit the minimal proven form rather
than reconstructing them here.

Wire format (what ndscan actually decodes):

* ``overrides``: ``{fqn: [{"path": "", "value": <v>}]}`` — a *list* of
  path/value specs per FQN, not a bare scalar.
* ``scan.axes[i]``: ``{"type": <generator>, "range": {...}, "fqn": <fqn>,
  "path": ""}`` where ``type`` is an ndscan generator name and ``range`` is the
  generator's constructor kwargs (every generator requires ``randomise_order``).
"""

from __future__ import annotations

import json
from typing import Any

from .ndscan_validation import _extract_schemata_from_arginfo
from .notifiers import get_explist

# ndscan scan-generator names (see ndscan.experiment.scan_generator.GENERATORS).
# These are the generators the high-level scan API exposes; the values map to
# the constructor kwargs each one requires (beyond ``randomise_order``, which is
# common to all and defaulted to False when the caller omits it).
SUPPORTED_GENERATORS = {
    "linear": ("start", "stop", "num_points"),
    "centre_span": ("centre", "half_span", "num_points"),
    "list": ("values",),
}


def _build_axis(axis: dict) -> dict:
    """Normalise one high-level axis dict into ndscan wire format.

    Adds the required ``path`` key and a default ``randomise_order`` and checks
    that ``type`` is a supported ndscan generator with the keys it needs.  The
    range is otherwise passed through verbatim (its values are the generator's
    constructor arguments).
    """
    fqn = axis.get("fqn")
    if not fqn or not isinstance(fqn, str):
        raise ValueError("scan axis missing 'fqn'")

    gtype = axis.get("type")
    if gtype not in SUPPORTED_GENERATORS:
        raise ValueError(f"invalid scan type '{gtype}'. Must be one of: {', '.join(sorted(SUPPORTED_GENERATORS))}")

    range_in = axis.get("range")
    if not isinstance(range_in, dict):
        raise ValueError(f"scan axis '{fqn}' missing or invalid 'range'")

    required = SUPPORTED_GENERATORS[gtype]
    missing = [k for k in required if k not in range_in]
    if missing:
        raise ValueError(f"scan axis '{fqn}' ({gtype}) range missing keys: {', '.join(missing)}")

    # Every ndscan generator's __init__ takes randomise_order as a required
    # positional; default it so callers don't have to specify it.
    range_out = dict(range_in)
    range_out.setdefault("randomise_order", False)

    return {"type": gtype, "range": range_out, "fqn": fqn, "path": ""}


async def build_ndscan_params(
    file: str,
    class_name: str,
    axes: list[dict],
    fixed_params: dict[str, Any] | None = None,
    num_repeats: int = 1,
) -> str:
    """Build the ``ndscan_params`` argument value (a PYON/JSON string).

    Fetches the experiment's arginfo to confirm it is an ndscan experiment, then
    assembles the minimal ``{overrides, scan}`` params dict in ndscan's decoded
    wire format and returns it JSON-encoded (valid PYON for primitive content).

    Args:
        file: Experiment file path (e.g. "scans/rabi.py").
        class_name: Experiment class name (e.g. "RabiFlop").
        axes: List of high-level scan-axis dicts, each with ``fqn``, ``type``
            (ndscan generator name), and ``range`` keys.
        fixed_params: Dict mapping FQN to a fixed override value.  Each becomes
            ``{fqn: [{"path": "", "value": value}]}`` in ``overrides``.
        num_repeats: Number of repeat runs (default: 1).

    Returns:
        The ndscan_params value as a JSON string, ready to submit as
        ``arguments={"ndscan_params": <this string>}``.

    Raises:
        ValueError: If the experiment is not found in the explist, does not have
            ndscan schemata, or an axis is malformed.
    """
    explist = await get_explist()

    arginfo = None
    for exp in explist.experiments:
        if exp.file == file and exp.class_name == class_name:
            arginfo = exp.arginfo
            break

    if arginfo is None:
        raise ValueError(f"Experiment {file}/{class_name} not found in explist")

    # Confirm this is an ndscan experiment (has scannable schemata).  We don't
    # embed the schemata in the value — ndscan rebuilds them from the fragment.
    schemata = _extract_schemata_from_arginfo(arginfo)
    if not schemata:
        raise ValueError(f"Experiment {file}/{class_name} has no ndscan schemata")

    overrides = {fqn: [{"path": "", "value": value}] for fqn, value in (fixed_params or {}).items()}

    params_data = {
        "overrides": overrides,
        "scan": {
            "axes": [_build_axis(ax) for ax in axes],
            "num_repeats": num_repeats,
            "no_axes_mode": "single",
            "randomise_order_globally": False,
        },
    }

    return json.dumps(params_data)
