import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from artiq_http.main import fastapi_app

client = TestClient(fastapi_app)
LOG_DIR = Path(__file__).parent / "logs"

# Mark all tests in this module as requiring a real ARTIQ server
pytestmark = pytest.mark.realserver


def test_schedule():
    response = client.get("/api/schedule")
    assert response.status_code == 200
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "schedule_debug.json").write_text(json.dumps(response.json()))


def test_devices():
    response = client.get("/api/devices")
    assert response.status_code == 200
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "devices_debug.json").write_text(json.dumps(response.json()))


def test_datasets():
    response = client.get("/api/datasets")
    assert response.status_code == 200
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "datasets_debug.json").write_text(json.dumps(response.json()))


def test_get_explist():
    """Test GET /explist endpoint"""
    response = client.get("/api/explist")
    assert response.status_code == 200
    # Response should be an ExperimentList model
    data = response.json()

    # Write response to a debug file
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "explist_debug.json").write_text(json.dumps(data))

    assert "experiments" in data
    assert "scanning" in data
    assert "current_rev" in data
