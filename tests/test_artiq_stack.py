import json
import time
from pathlib import Path

import pytest

from artiq_http.artiq_api.models import ExpID
from artiq_http.artiq_api.ndscan_validation import _extract_schemata_from_arginfo

LOG_DIR = Path(__file__).parent / "logs"

# Mark all tests in this module as requiring a real ARTIQ server
pytestmark = pytest.mark.realserver

# The scannable ndscan experiment baked into the test-artiq repository.
# ARTIQ discovers experiments via ``inspect.getmembers``, so the registered
# class_name is the *module attribute name* the scan experiment is bound to
# (``ScannableScan``), not the fragment class name.
SCANNABLE_FILE = "scannable_exp.py"
SCANNABLE_CLASS = "ScannableScan"


def test_get_explist(client):
    """Test GET /explist endpoint with real ARTIQ master"""
    # Poll until experiments are loaded - ARTIQ master may take time to scan
    # the repository after startup, so the list may initially be empty.
    data = {}
    for _ in range(30):
        response = client.get("/api/explist")
        assert response.status_code == 200
        data = response.json()
        if data.get("experiments"):
            break
        time.sleep(1)

    assert "experiments" in data
    assert "scanning" in data
    assert "current_rev" in data
    # No ARTIQ_HTTP_DEFAULT_REVISION configured for this stack, so the blank-revision
    # fallback the GUI uses should mirror the master's current revision.
    assert data["default_revision_fallback"] == data["current_rev"]

    # Check if our expected experiments are there
    exp_names = [exp["file"] for exp in data["experiments"]]
    assert "simple_exp.py" in exp_names
    assert "ndscan_exp.py" in exp_names


def test_submit_and_check_schedule(client):
    """Test submitting an experiment and checking it in the schedule"""
    # 1. Submit simple_exp.py using REST API
    # Use a unique count to avoid collision with other tests
    exp_id = ExpID(file="simple_exp.py", class_name="SimpleExp", arguments={"count": 11}, repo_rev="repository")

    response = client.post("/api/schedule", json=exp_id.model_dump())
    assert response.status_code == 200

    # 2. Check schedule
    # SimpleExp is very fast, so we might miss it if we don't check quickly or if it finishes instantly.
    # In our test-artiq stack, it has a delay usually.

    # Give it a tiny bit of time to show up
    time.sleep(0.5)

    response = client.get("/api/schedule")
    assert response.status_code == 200
    schedule = response.json()

    # The schedule is a dict with RID as key
    assert len(schedule) >= 0  # Might have finished already

    # Logs for debugging
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "test_schedule.json").write_text(json.dumps(schedule))


def test_datasets_after_exp(client):
    """Test that datasets are populated after an experiment runs"""
    # 1. Run SimpleExp which sets 'results'
    # Use count=15 as per the user's latest change
    exp_id = ExpID(file="simple_exp.py", class_name="SimpleExp", arguments={"count": 15}, repo_rev="repository")
    response = client.post("/api/schedule", json=exp_id.model_dump())
    assert response.status_code == 200

    # 2. Wait for it to finish and datasets to show up (poll for up to 10 seconds)
    datasets = {}
    for _ in range(20):
        response = client.get("/api/datasets")
        assert response.status_code == 200
        datasets = response.json()
        # Verify that we got the value we just set (15) to avoid catching the previous test's 11
        if "results" in datasets and datasets["results"][1] == 15:
            break
        time.sleep(0.5)

    # 3. Check datasets
    print(datasets)
    assert "results" in datasets
    # ARTIQ datasets via this API are returned as [persist, value, metadata]
    assert datasets["results"][1][1] == 15


def test_devices_list(client):
    """Test getting devices list"""
    response = client.get("/api/devices")
    assert response.status_code == 200
    devices = response.json()

    assert "core" in devices
    assert "core_log" in devices


def test_get_schedule_by_rid_missing(client):
    """GET /api/schedule/99999 returns 404 for an unknown RID."""
    response = client.get("/api/schedule/99999")
    assert response.status_code == 404


def test_explist_search(client):
    """GET /api/explist/search?q=exp returns 200 with a list of experiments."""
    response = client.get("/api/explist/search?q=exp")
    assert response.status_code == 200
    data = response.json()
    assert "experiments" in data
    assert isinstance(data["experiments"], list)


# ---------------------------------------------------------------------------
# High-level scan submission (POST /api/scan) against the real ARTIQ master
# ---------------------------------------------------------------------------


def _scannable_schemata(client):
    """Fetch the live arginfo for the scannable experiment and return its
    ndscan schemata (a dict keyed by fully-qualified parameter name)."""
    response = client.get(f"/api/explist/{SCANNABLE_FILE}/{SCANNABLE_CLASS}/arginfo")
    assert response.status_code == 200, response.text
    arginfo = response.json()["arginfo"]
    schemata = _extract_schemata_from_arginfo(arginfo)
    assert schemata, "scannable_exp.py should expose ndscan schemata"
    return schemata


def _fqn_ending_in(schemata, suffix):
    """Return the FQN in *schemata* ending with *suffix* (e.g. '.frequency')."""
    for fqn in schemata:
        if fqn.endswith(suffix):
            return fqn
    raise AssertionError(f"no schema FQN ending in '{suffix}' found in {list(schemata)}")


def _dataset_value(datasets, key):
    """Unwrap a dataset value from the ``[persist, value, metadata]`` envelope."""
    entry = datasets.get(key)
    if isinstance(entry, list) and len(entry) >= 2:
        return entry[1]
    return entry


def _poll_scan_points(client, rid, expected_points, attempts=40):
    """Poll /api/datasets until the ndscan run for *rid* has produced points.

    Returns (axis_0_values, completed_flag). Asserting on these — rather than on
    "the RID left the schedule" — is what actually proves the scan ran: a run
    that crashes in prepare also leaves the schedule but produces no points.
    """
    axis_key = f"ndscan.rid_{rid}.points.axis_0"
    done_key = f"ndscan.rid_{rid}.completed"
    axis = done = None
    for _ in range(attempts):
        datasets = client.get("/api/datasets").json()
        axis = _dataset_value(datasets, axis_key)
        done = _dataset_value(datasets, done_key)
        if axis is not None and len(axis) >= expected_points:
            break
        time.sleep(0.5)
    return axis, done


def test_scannable_exp_present(client):
    """The scannable ndscan experiment is discovered by the real master."""
    response = client.get("/api/explist")
    assert response.status_code == 200
    exp_names = [exp["file"] for exp in response.json()["experiments"]]
    assert SCANNABLE_FILE in exp_names


def test_scannable_exp_exposes_schemata(client):
    """The scannable experiment exposes its scannable parameters as schemata."""
    schemata = _scannable_schemata(client)
    # Both float parameters should be scannable and therefore present.
    _fqn_ending_in(schemata, ".frequency")
    _fqn_ending_in(schemata, ".amplitude")


def test_submit_1d_scan(client):
    """POST /api/scan with a 1D linear scan submits, runs, and produces points.

    A returned RID only proves the scheduler accepted the submission — the run
    can still die in the prepare stage (which is exactly how the original
    ndscan_params format bug manifested). So we also confirm the scan actually
    produced the expected number of points.
    """
    schemata = _scannable_schemata(client)
    fqn = _fqn_ending_in(schemata, ".frequency")

    req = {
        "file": SCANNABLE_FILE,
        "class_name": SCANNABLE_CLASS,
        "axes": [
            {
                "fqn": fqn,
                "type": "linear",
                "range": {"start": 1.0, "stop": 5.0, "num_points": 5},
            }
        ],
    }
    response = client.post("/api/scan", json=req)
    assert response.status_code == 200, response.text
    rid = response.json()
    assert isinstance(rid, int)
    assert rid >= 0

    axis, completed = _poll_scan_points(client, rid, expected_points=5)
    assert axis is not None, f"scan RID {rid} produced no points (did it crash in prepare?)"
    assert len(axis) == 5, f"expected 5 points, got {len(axis)}: {axis}"
    assert completed is True


def test_submit_multi_axis_scan(client):
    """POST /api/scan with two scan axes submits successfully."""
    schemata = _scannable_schemata(client)
    freq = _fqn_ending_in(schemata, ".frequency")
    amp = _fqn_ending_in(schemata, ".amplitude")

    req = {
        "file": SCANNABLE_FILE,
        "class_name": SCANNABLE_CLASS,
        "axes": [
            {"fqn": freq, "type": "linear", "range": {"start": 1.0, "stop": 3.0, "num_points": 3}},
            {"fqn": amp, "type": "linear", "range": {"start": 0.1, "stop": 0.3, "num_points": 3}},
        ],
    }
    response = client.post("/api/scan", json=req)
    assert response.status_code == 200, response.text
    assert isinstance(response.json(), int)


def test_submit_scan_and_wait_completes(client):
    """POST /api/scan?wait_for_completion=true runs a host-only scan to completion."""
    schemata = _scannable_schemata(client)
    fqn = _fqn_ending_in(schemata, ".frequency")

    req = {
        "file": SCANNABLE_FILE,
        "class_name": SCANNABLE_CLASS,
        "axes": [
            {
                "fqn": fqn,
                "type": "linear",
                "range": {"start": 1.0, "stop": 4.0, "num_points": 4},
            }
        ],
    }
    response = client.post("/api/scan?wait_for_completion=true&timeout=120", json=req)
    assert response.status_code == 200, response.text
    result = response.json()
    assert result["rid"] >= 0
    # status=="completed" now means "left the schedule without a logged failure"
    # — a prepare/run crash would come back as "failed".
    assert result["status"] == "completed", f"scan did not complete cleanly: {result}"
    assert result["timed_out"] is False
    assert result.get("error") is None

    # And confirm the run genuinely produced data, not just vanished.
    axis, completed = _poll_scan_points(client, result["rid"], expected_points=4)
    assert axis is not None, "wait_for_completion reported completed but produced no points"
    assert len(axis) == 4
    assert completed is True


def test_submit_scan_unknown_experiment(client):
    """POST /api/scan for a non-existent experiment returns 404."""
    req = {
        "file": "does_not_exist.py",
        "class_name": "NoSuchExperiment",
        "axes": [{"fqn": "x.y", "type": "linear", "range": {"start": 0.0, "stop": 1.0, "num_points": 2}}],
    }
    response = client.post("/api/scan", json=req)
    assert response.status_code == 404, response.text


def test_submit_scan_unknown_experiment_by_ref(client):
    """POST /api/scan by-ref for a non-existent experiment returns 404, not 500.

    With ``repo_rev`` set the server examines the experiment at that revision
    instead of consulting the cached explist. A missing file makes the master's
    examine worker raise; this must surface as a 404 rather than an internal
    server error (experiments differ between branches).
    """
    req = {
        "file": "does_not_exist.py",
        "class_name": "NoSuchExperiment",
        "repo_rev": "master",
        "axes": [{"fqn": "x.y", "type": "linear", "range": {"start": 0.0, "stop": 1.0, "num_points": 2}}],
    }
    response = client.post("/api/scan", json=req)
    assert response.status_code == 404, response.text


def test_submit_scan_unknown_fqn(client):
    """POST /api/scan referencing a parameter the experiment lacks returns 422."""
    req = {
        "file": SCANNABLE_FILE,
        "class_name": SCANNABLE_CLASS,
        "axes": [
            {
                "fqn": "scannable_exp.ScannableFrag.does_not_exist",
                "type": "linear",
                "range": {"start": 0.0, "stop": 1.0, "num_points": 2},
            }
        ],
    }
    response = client.post("/api/scan", json=req)
    assert response.status_code == 422, response.text
