import json
from pathlib import Path
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from artiq_http.main import fastapi_app

client = TestClient(fastapi_app)
LOG_DIR = Path(__file__).parent / "logs"


def test_read_main():
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.cancel_experiment", new_callable=AsyncMock)
def test_cancel_experiment_success(mock_cancel, mock_get_schedule):
    """Test POST /cancel with valid RID"""
    # Setup mock schedule with test RID
    mock_get_schedule.return_value = {
        123: {"pipeline": "main", "priority": 0, "status": "running"}
    }
    mock_cancel.return_value = None

    response = client.post("/api/cancel?rid=123&force=false")
    assert response.status_code == 200


@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
def test_cancel_experiment_not_found(mock_get_schedule):
    """Test POST /cancel with invalid RID"""
    # Setup mock schedule without the requested RID
    mock_get_schedule.return_value = {}

    response = client.post("/api/cancel?rid=999&force=false")
    assert response.status_code == 404
    assert "not found in schedule" in response.json()["detail"]
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "cancel_not_found_debug.json").write_text(json.dumps(response.json()))


@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.cancel_experiment", new_callable=AsyncMock)
def test_cancel_experiment_with_force(mock_cancel, mock_get_schedule):
    """Test POST /cancel with force=True"""
    mock_get_schedule.return_value = {
        456: {"pipeline": "main", "priority": 0, "status": "running"}
    }
    mock_cancel.return_value = None

    response = client.post("/api/cancel?rid=456&force=true")
    assert response.status_code == 200


@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_experiment_success(mock_submit):
    """Test POST /schedule with valid experiment"""
    mock_submit.return_value = None

    expid_data = {
        "log_level": 30,
        "file": "test_experiment.py",
        "class_name": "TestExperiment",
        "arguments": {"arg1": "value1"},
        "repo_rev": None,
    }

    response = client.post(
        "/api/schedule?pipeline=main&priority=0&flush=false", json=expid_data
    )
    assert response.status_code == 200


@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_experiment_with_due_date(mock_submit):
    """Test POST /schedule with due_date parameter"""
    mock_submit.return_value = None

    expid_data = {
        "log_level": 30,
        "file": "test_experiment.py",
        "class_name": "TestExperiment",
        "arguments": {},
        "repo_rev": None,
    }

    response = client.post(
        "/api/schedule?pipeline=main&priority=5&flush=true&due_date=1234567890.0",
        json=expid_data,
    )
    assert response.status_code == 200


@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_experiment_value_error(mock_submit):
    """Test POST /schedule with invalid data causing ValueError"""
    mock_submit.side_effect = ValueError("Invalid experiment configuration")

    expid_data = {
        "log_level": 30,
        "file": "invalid.py",
        "class_name": "Invalid",
        "arguments": {},
        "repo_rev": None,
    }

    response = client.post(
        "/api/schedule?pipeline=main&priority=0&flush=false", json=expid_data
    )
    assert response.status_code == 422
    assert "Invalid experiment configuration" in response.json()["detail"]
    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "submit_value_error_debug.json").write_text(json.dumps(response.json()))
