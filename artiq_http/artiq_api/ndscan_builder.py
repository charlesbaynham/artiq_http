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

* ``overrides``: ``{fqn: [{"path": <instance_path>, "value": <v>}]}`` — a *list*
  of path/value specs per FQN, not a bare scalar.
* ``scan.axes[i]``: ``{"type": <generator>, "range": {...}, "fqn": <fqn>,
  "path": <instance_path>}`` where ``type`` is an ndscan generator name and
  ``range`` is the generator's constructor kwargs (every generator requires
  ``randomise_order``).

The ``path`` is the *instance path* at which the parameter is mounted.  ndscan
keys every override/axis store by ``(fqn, path)`` and binds it only to a handle
whose path matches; the top-level experiment fragment is ``""`` while a
parameter defined on a sub-fragment lives at that sub-fragment's path (e.g.
``"readout"``).  We resolve each FQN to its real instance path from the
experiment's ``instances`` map rather than hardcoding ``""`` (see
:func:`_resolve_path`).
"""

from __future__ import annotations

import json
from typing import Any

from . import control_schedule
from .ndscan_validation import _extract_instances_from_arginfo, _extract_schemata_from_arginfo
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


def _invert_instances(instances: dict) -> dict[str, list[str]]:
    """Invert ndscan's ``instances`` map (``{path: [fqn, ...]}``) into a
    ``{fqn: [path, ...]}`` lookup.

    A given FQN may be mounted at more than one instance path (e.g. the same
    sub-fragment type used twice), so each FQN maps to a *list* of paths.  Paths
    are de-duplicated while preserving first-seen order for stable error
    messages.
    """
    fqn_to_paths: dict[str, list[str]] = {}
    for path, fqns in instances.items():
        if not isinstance(fqns, (list, tuple)):
            continue
        for fqn in fqns:
            paths = fqn_to_paths.setdefault(fqn, [])
            if path not in paths:
                paths.append(path)
    return fqn_to_paths


def _resolve_path(fqn: str, explicit_path: str | None, fqn_to_paths: dict[str, list[str]]) -> str:
    """Resolve the instance path at which *fqn*'s override/axis store should sit.

    * If the caller gave an ``explicit_path``, it is honoured (and validated
      against the known instance paths for *fqn* when those are available).
    * Otherwise the path is looked up from the inverted ``instances`` map:
      a unique match is used directly; an ambiguous FQN (present at multiple
      paths) raises and demands an explicit path; an FQN with no instance
      information falls back to ``""`` for backward compatibility.
    """
    candidates = fqn_to_paths.get(fqn)

    if explicit_path is not None:
        if not isinstance(explicit_path, str):
            raise ValueError(f"explicit path for '{fqn}' must be a string, got {type(explicit_path).__name__}")
        if candidates and explicit_path not in candidates:
            raise ValueError(
                f"explicit path '{explicit_path}' for '{fqn}' is not one of its instance paths {candidates}"
            )
        return explicit_path

    if not candidates:
        # No instance information (e.g. arginfo without an ``instances`` map):
        # preserve the historical top-level behaviour.
        return ""
    if len(candidates) == 1:
        return candidates[0]
    raise ValueError(
        f"parameter '{fqn}' exists at multiple instance paths {candidates}; specify the path explicitly to disambiguate"
    )


def _split_fixed_param(value: Any) -> tuple[Any, str | None]:
    """Split a ``fixed_params`` value into ``(value, explicit_path)``.

    A plain scalar means "override this FQN, auto-resolving its path".  To pin a
    specific instance path (needed only when an FQN is ambiguous), pass a dict
    ``{"value": <v>, "path": <instance_path>}``.  ndscan scannable parameters are
    always scalars, so a dict value unambiguously denotes the explicit form.
    """
    if isinstance(value, dict) and "value" in value:
        return value["value"], value.get("path")
    return value, None


def _build_axis(axis: dict, fqn_to_paths: dict[str, list[str]]) -> dict:
    """Normalise one high-level axis dict into ndscan wire format.

    Resolves the required ``path`` key (from the axis's optional explicit
    ``path`` or the experiment's ``instances`` map) and a default
    ``randomise_order``, and checks that ``type`` is a supported ndscan
    generator with the keys it needs.  The range is otherwise passed through
    verbatim (its values are the generator's constructor arguments).
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

    path = _resolve_path(fqn, axis.get("path"), fqn_to_paths)
    return {"type": gtype, "range": range_out, "fqn": fqn, "path": path}


async def fetch_scan_arginfo(
    file: str,
    class_name: str,
    repo_rev: str | None = None,
) -> dict:
    """Fetch the arginfo for an experiment, optionally at a specific revision.

    When *repo_rev* is ``None`` the arginfo is read from the cached explist (the
    master's current revision).  When *repo_rev* is given the experiment is
    re-examined at that git revision/branch/tag — the same mechanism behind the
    dashboard's "Recompute all arguments" — so an experiment that does not exist
    on the current revision can still be scanned *by ref*.

    Args:
        file: Experiment file path (e.g. "scans/rabi.py").
        class_name: Experiment class name (e.g. "RabiFlop").
        repo_rev: Git revision/branch/tag to examine, or ``None`` for the
            master's current revision.

    Returns:
        The experiment's arginfo dict.

    Raises:
        ValueError: If the experiment is not found (in the explist, or at the
            requested revision).
    """
    if repo_rev is None:
        explist = await get_explist()
        for exp in explist.experiments:
            if exp.file == file and exp.class_name == class_name:
                return exp.arginfo or {}
        raise ValueError(f"Experiment {file}/{class_name} not found in explist")

    description = await control_schedule.examine_experiment(file, repo_rev)
    if class_name not in description:
        raise ValueError(f"Experiment {file}/{class_name} not found at revision {repo_rev}")
    return description[class_name].get("arginfo") or {}


def build_ndscan_params_from_arginfo(
    arginfo: dict,
    file: str,
    class_name: str,
    axes: list[dict],
    fixed_params: dict[str, Any] | None = None,
    num_repeats: int = 1,
) -> str:
    """Assemble the ``ndscan_params`` value from already-fetched *arginfo*.

    See :func:`build_ndscan_params` for the full contract; this variant takes the
    arginfo directly so callers that have already fetched it (e.g. to validate
    against the same revision) do not re-fetch.

    Raises:
        ValueError: If the experiment has no ndscan schemata or an axis is
            malformed.
    """
    # Confirm this is an ndscan experiment (has scannable schemata).  We don't
    # embed the schemata in the value — ndscan rebuilds them from the fragment.
    schemata = _extract_schemata_from_arginfo(arginfo)
    if not schemata:
        raise ValueError(f"Experiment {file}/{class_name} has no ndscan schemata")

    # Map each FQN to the instance path(s) it is mounted at, so sub-fragment
    # parameters are targeted at their real path rather than the top level.
    fqn_to_paths = _invert_instances(_extract_instances_from_arginfo(arginfo))

    overrides: dict[str, list[dict[str, Any]]] = {}
    for fqn, raw in (fixed_params or {}).items():
        value, explicit_path = _split_fixed_param(raw)
        path = _resolve_path(fqn, explicit_path, fqn_to_paths)
        overrides[fqn] = [{"path": path, "value": value}]

    params_data = {
        "overrides": overrides,
        "scan": {
            "axes": [_build_axis(ax, fqn_to_paths) for ax in axes],
            "num_repeats": num_repeats,
            "no_axes_mode": "single",
            "randomise_order_globally": False,
        },
    }

    return json.dumps(params_data)


async def build_ndscan_params(
    file: str,
    class_name: str,
    axes: list[dict],
    fixed_params: dict[str, Any] | None = None,
    num_repeats: int = 1,
    repo_rev: str | None = None,
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
        fixed_params: Dict mapping FQN to a fixed override value.  The value is
            normally the scalar to hold the parameter at; its instance path is
            resolved automatically from the experiment's ``instances`` map.  To
            pin an ambiguous FQN to a specific instance path, pass
            ``{"value": <v>, "path": <instance_path>}`` instead of a bare scalar.
            Each becomes ``{fqn: [{"path": <resolved>, "value": value}]}`` in
            ``overrides``.
        num_repeats: Number of repeat runs (default: 1).
        repo_rev: Git revision/branch/tag to source the experiment's arginfo
            from.  ``None`` uses the master's current revision; otherwise the
            experiment is re-examined at *repo_rev* so an experiment present only
            on another branch can be scanned by ref.

    Returns:
        The ndscan_params value as a JSON string, ready to submit as
        ``arguments={"ndscan_params": <this string>}``.

    Raises:
        ValueError: If the experiment is not found, does not have ndscan
            schemata, or an axis is malformed.
    """
    arginfo = await fetch_scan_arginfo(file, class_name, repo_rev)
    return build_ndscan_params_from_arginfo(arginfo, file, class_name, axes, fixed_params, num_repeats)
