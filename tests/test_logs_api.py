"""Mock-based unit tests for the GET /api/logs endpoint."""

from fastapi.testclient import TestClient

from artiq_http.artiq_api.persistent_subscriber import subscriber_manager
from artiq_http.main import fastapi_app

client = TestClient(fastapi_app)


SAMPLE_LOGS = [
    {
        "timestamp": 1714000000.0,
        "source": "master",
        "level": 20,
        "message": "experiment started",
    },
    {
        "timestamp": 1714000001.5,
        "source": "scheduler",
        "level": 30,
        "message": "rid 42 deferred",
    },
]


def test_logs_endpoint_returns_logs(monkeypatch):
    """GET /api/logs returns the buffered entries from the subscriber manager."""
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(SAMPLE_LOGS))

    response = client.get("/api/logs")
    assert response.status_code == 200
    data = response.json()

    assert "logs" in data
    assert len(data["logs"]) == len(SAMPLE_LOGS)

    for actual, expected in zip(data["logs"], SAMPLE_LOGS):
        assert actual["timestamp"] == expected["timestamp"]
        assert actual["source"] == expected["source"]
        assert actual["level"] == expected["level"]
        assert actual["message"] == expected["message"]


def test_logs_endpoint_503_when_not_ready(monkeypatch):
    """GET /api/logs returns 503 when the log subscriber is not initialised."""

    def raise_runtime():
        raise RuntimeError("logs subscriber not initialized")

    monkeypatch.setattr(subscriber_manager, "get_logs", raise_runtime)

    response = client.get("/api/logs")
    assert response.status_code == 503
    assert "ARTIQ master not available" in response.json()["detail"]


def test_logs_endpoint_empty_when_no_logs(monkeypatch):
    """GET /api/logs returns ``{"logs": []}`` when the buffer is empty."""
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: [])

    response = client.get("/api/logs")
    assert response.status_code == 200
    assert response.json() == {"logs": []}


def test_logs_endpoint_falls_back_to_raw_dict_on_invalid_shape(monkeypatch):
    """Entries that don't match LogEntry are returned as-is."""
    raw_entries = [
        {
            "timestamp": 1714000000.0,
            "source": "master",
            "level": 20,
            "message": "ok",
        },
        {"unknown_field": "no required fields here"},
    ]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw_entries))

    response = client.get("/api/logs")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 2
    assert logs[0]["source"] == "master"
    # The malformed entry is passed through unchanged.
    assert logs[1] == {"unknown_field": "no required fields here"}
