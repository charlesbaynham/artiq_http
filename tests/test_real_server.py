import json
from pathlib import Path

import pytest

LOG_DIR = Path(__file__).parent / "logs"

# Mark all tests in this module as requiring a real ARTIQ server
pytestmark = pytest.mark.realserver


def test_schedule(client):
    response = client.get("/api/schedule")
    assert response.status_code == 200
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "schedule_debug.json").write_text(json.dumps(response.json()))


def test_devices(client):
    response = client.get("/api/devices")
    assert response.status_code == 200
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "devices_debug.json").write_text(json.dumps(response.json()))


def test_datasets(client):
    response = client.get("/api/datasets")
    assert response.status_code == 200
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "datasets_debug.json").write_text(json.dumps(response.json()))


def test_get_explist(client):
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


def test_datasets_stream_sends_init_event(client):
    """Test SSE dataset stream returns an init event and stream headers."""
    datasets_response = client.get("/api/datasets")
    assert datasets_response.status_code == 200
    datasets = datasets_response.json()

    prefix = "ndscan.rid_missing"
    for key in datasets:
        if "." in key:
            prefix = key.rsplit(".", 1)[0]
            break

    with client.stream("GET", f"/api/datasets/stream/{prefix}") as response:
        assert response.status_code == 200
        assert response.headers["content-type"].startswith("text/event-stream")
        assert response.headers["cache-control"] == "no-cache"
        assert response.headers["connection"] == "keep-alive"
        assert response.headers["x-accel-buffering"] == "no"

        first_chunk = next(response.iter_text())

    assert first_chunk.startswith("event: init\n")
