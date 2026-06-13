"""Real-server integration tests for sub-fragment (nested) ndscan parameters.

These exercise the fix in ``ndscan_builder`` that resolves each parameter's
*instance path* from the experiment's ndscan ``instances`` map, so a parameter
defined on a sub-fragment (instance path ``"readout"`` rather than the
top-level ``""``) can be overridden/scanned through the high-level scan API.

They require the local ARTIQ test stack (``--realserver``).  The bundled
``rabi_flop.py`` exposes ``ScanRabiFlopSim`` whose ``Readout`` sub-fragment
parameters (e.g. ``rabi_flop.Readout.mean_1``) live at instance path
``"readout"`` — exactly the case that previously failed at run time with
``Override for '<fqn>' in path '' did not match any parameters``.
"""

import json

import pytest

pytestmark = pytest.mark.realserver


def _ndscan_default(arginfo: dict) -> dict:
    """Decode an experiment's ndscan_params default payload, or {} if malformed.

    Defensive so a single odd explist entry can't crash the whole search — the
    caller just skips to the next experiment.
    """
    try:
        data = json.loads(arginfo["ndscan_params"][0]["default"])
    except (KeyError, IndexError, TypeError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def _find_nested_ndscan(client) -> dict:
    """Find an ndscan experiment that has a parameter on a sub-fragment.

    Returns a dict describing a usable sub-fragment parameter:
    ``file``, ``class_name``, ``override_fqn`` (+ ``override_path``), and — when
    available — a scannable float sub-fragment parameter (``scan_fqn``,
    ``scan_default``) for exercising axis-path resolution.  Skips if no
    experiment in the explist has a sub-fragment parameter.
    """
    response = client.get("/api/explist?fields=file,class_name,arginfo&full=true")
    assert response.status_code == 200

    for experiment in response.json()["experiments"]:
        arginfo = experiment.get("arginfo") or {}
        if "ndscan_params" not in arginfo:
            continue

        default = _ndscan_default(arginfo)
        instances = default.get("instances", {})
        schemata = default.get("schemata", {})
        if not isinstance(instances, dict) or not isinstance(schemata, dict):
            continue

        # First FQN mounted at a non-top-level instance path.
        override_fqn = override_path = None
        scan_fqn = scan_default = None
        for path, fqns in instances.items():
            if path == "":
                continue
            for fqn in fqns:
                if override_fqn is None:
                    override_fqn, override_path = fqn, path
                schema = schemata.get(fqn, {})
                if scan_fqn is None and schema.get("type") == "float" and schema.get("spec", {}).get("is_scannable"):
                    scan_fqn = fqn
                    scan_default = float(schema.get("default", "1.0"))

        if override_fqn is not None:
            return {
                "file": experiment["file"],
                "class_name": experiment["class_name"],
                "override_fqn": override_fqn,
                "override_path": override_path,
                "override_type": schemata.get(override_fqn, {}).get("type"),
                "scan_fqn": scan_fqn,
                "scan_default": scan_default,
            }

    pytest.skip("No ndscan experiment with a sub-fragment parameter is available")


def _sample_value(param_type: str | None):
    """A safe override value for a parameter of the given schema type."""
    return {"float": 1.0, "int": 1, "bool": True}.get(param_type, 1.0)


# The bundled test stack's dummy core (CommKernelDummy) lacks a ``close()``
# method on this ARTIQ version, so the *worker* crashes at device teardown.
# device_db.py's shim only patches the master process (the worker builds devices
# over IPC via ParentDeviceDB), so it does not help here.  This teardown crash
# is unrelated to parameter-path resolution and is tracked separately; tolerate
# it so these tests assert only on what the fix controls.
_KNOWN_TEARDOWN_BUG = "CommKernelDummy"


def _assert_param_bound(result: dict) -> None:
    """Assert the override/axis bound at the correct instance path.

    Correct binding means ndscan's ``prepare()`` did NOT raise the path-mismatch
    error (``did not match any parameters``) — that error is exactly the bug the
    fix addresses, and it happens *before* the run.  The run therefore either
    completes, or (only on this test stack) trips the unrelated dummy-core
    teardown crash; any other failure is a real problem.
    """
    error = result.get("error") or ""
    assert "did not match" not in error, f"parameter failed to bind at its instance path: {error}"
    if result["status"] != "completed":
        assert _KNOWN_TEARDOWN_BUG in error, f"unexpected run failure: {result}"


def test_subfragment_fixed_param_resolves_and_runs(client):
    """A sub-fragment fixed param is accepted and the run completes.

    The override is auto-targeted at the sub-fragment instance path; if it were
    (as before) emitted at path "", ndscan's prepare() would raise
    "did not match any parameters" and the run would be reported as failed.
    """
    assert client.get("/api/health").json()["artiq_connected"] is True
    exp = _find_nested_ndscan(client)

    response = client.post(
        "/api/scan",
        params={"wait_for_completion": True, "timeout": 180},
        json={
            "file": exp["file"],
            "class_name": exp["class_name"],
            "axes": [],
            "fixed_params": {exp["override_fqn"]: _sample_value(exp["override_type"])},
        },
    )
    assert response.status_code == 200, response.text
    _assert_param_bound(response.json())


def test_subfragment_scan_axis_resolves_and_runs(client):
    """Scanning a sub-fragment parameter resolves the axis path and completes."""
    assert client.get("/api/health").json()["artiq_connected"] is True
    exp = _find_nested_ndscan(client)
    if not exp["scan_fqn"]:
        pytest.skip("No scannable float sub-fragment parameter available")

    d = exp["scan_default"]
    start, stop = (d * 0.5, d * 1.5) if d else (-1.0, 1.0)

    response = client.post(
        "/api/scan",
        params={"wait_for_completion": True, "timeout": 180},
        json={
            "file": exp["file"],
            "class_name": exp["class_name"],
            "axes": [
                {
                    "fqn": exp["scan_fqn"],
                    "type": "linear",
                    "range": {"start": start, "stop": stop, "num_points": 3},
                }
            ],
        },
    )
    assert response.status_code == 200, response.text
    _assert_param_bound(response.json())


def test_subfragment_override_at_top_level_path_fails(client):
    """Regression control: the old path-"" behaviour really does fail.

    Hand-build ndscan_params with the sub-fragment override pinned to the
    top-level path "" (what the builder emitted before the fix) and submit it
    raw.  ndscan must reject it at run time, proving the bug is real and the
    auto-resolution is what makes the well-formed case succeed.
    """
    assert client.get("/api/health").json()["artiq_connected"] is True
    exp = _find_nested_ndscan(client)
    assert exp["override_path"] != "", "test requires a genuinely nested parameter"

    bad_params = {
        "overrides": {exp["override_fqn"]: [{"path": "", "value": _sample_value(exp["override_type"])}]},
        "scan": {"axes": [], "num_repeats": 1, "no_axes_mode": "single", "randomise_order_globally": False},
    }

    response = client.post(
        "/api/schedule",
        params={"wait_for_completion": True, "timeout": 180},
        json={
            "file": exp["file"],
            "class_name": exp["class_name"],
            "arguments": {"ndscan_params": json.dumps(bad_params)},
        },
    )
    assert response.status_code == 200, response.text
    result = response.json()
    assert result["status"] == "failed", f"expected a failure, got {result}"
    assert "did not match" in (result["error"] or "")
