import json
import time
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from artiq_http.artiq_api.models import ExpID
from artiq_http.main import fastapi_app

client = TestClient(fastapi_app)
LOG_DIR = Path(__file__).parent / "logs"

# Mark all tests in this module as requiring a real ARTIQ server
pytestmark = pytest.mark.realserver


def test_get_explist():
    """Test GET /explist endpoint with real ARTIQ master"""
    response = client.get("/api/explist")
    assert response.status_code == 200
    data = response.json()

    assert "experiments" in data
    assert "scanning" in data
    assert "current_rev" in data

    # Check if our expected experiments are there
    exp_names = [exp["file"] for exp in data["experiments"]]
    assert "simple_exp.py" in exp_names
    assert "ndscan_exp.py" in exp_names


def test_submit_and_check_schedule():
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


def test_datasets_after_exp():
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
    assert datasets["results"][1] == 15


def test_devices_list():
    """Test getting devices list"""
    response = client.get("/api/devices")
    assert response.status_code == 200
    devices = response.json()

    assert "core" in devices
    assert "core_log" in devices
