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
    monkeypatch.setattr(subscriber_manager, "get_logs", list)

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


# ── Filtering tests ──────────────────────────────────────────────────────────


def test_logs_filter_by_source_regex(monkeypatch):
    raw = [
        {"timestamp": 1.0, "source": "master", "level": 20, "message": "ok"},
        {"timestamp": 2.0, "source": "scheduler", "level": 20, "message": "ok"},
        {"timestamp": 3.0, "source": "master", "level": 20, "message": "ok"},
    ]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw))

    response = client.get("/api/logs?source_regex=master")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 2
    assert all(e["source"] == "master" for e in logs)


def test_logs_filter_by_message_regex(monkeypatch):
    raw = [
        {"timestamp": 1.0, "source": "a", "level": 20, "message": "experiment started"},
        {"timestamp": 2.0, "source": "a", "level": 20, "message": "rid 42 deferred"},
        {"timestamp": 3.0, "source": "a", "level": 20, "message": "experiment finished"},
    ]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw))

    response = client.get("/api/logs?message_regex=experiment.*")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 2
    assert logs[0]["message"] == "experiment started"
    assert logs[1]["message"] == "experiment finished"


def test_logs_filter_by_min_max_level(monkeypatch):
    raw = [
        {"timestamp": 1.0, "source": "a", "level": 10, "message": "debug"},
        {"timestamp": 2.0, "source": "a", "level": 20, "message": "info"},
        {"timestamp": 3.0, "source": "a", "level": 30, "message": "warning"},
        {"timestamp": 4.0, "source": "a", "level": 40, "message": "error"},
    ]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw))

    response = client.get("/api/logs?min_level=20&max_level=30")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 2
    assert logs[0]["level"] == 20
    assert logs[1]["level"] == 30


def test_logs_filter_by_since_until(monkeypatch):
    raw = [
        {"timestamp": 1.0, "source": "a", "level": 20, "message": "a"},
        {"timestamp": 2.0, "source": "a", "level": 20, "message": "b"},
        {"timestamp": 3.0, "source": "a", "level": 20, "message": "c"},
    ]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw))

    response = client.get("/api/logs?since=1.5&until=2.5")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 1
    assert logs[0]["message"] == "b"


def test_logs_filter_limit(monkeypatch):
    raw = [{"timestamp": i, "source": "a", "level": 20, "message": str(i)} for i in range(10)]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw))

    response = client.get("/api/logs?limit=3")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 3
    assert logs[0]["message"] == "0"
    assert logs[1]["message"] == "1"
    assert logs[2]["message"] == "2"


def test_logs_filter_combined(monkeypatch):
    raw = [
        {"timestamp": 1.0, "source": "master", "level": 20, "message": "foo"},
        {"timestamp": 2.0, "source": "scheduler", "level": 30, "message": "bar"},
        {"timestamp": 3.0, "source": "master", "level": 40, "message": "baz"},
    ]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw))

    response = client.get("/api/logs?source_regex=master&min_level=30")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 1
    assert logs[0]["message"] == "baz"


def test_logs_filter_invalid_regex_returns_400(monkeypatch):
    monkeypatch.setattr(subscriber_manager, "get_logs", list)

    response = client.get("/api/logs?source_regex=[invalid")
    assert response.status_code == 400
    assert "Invalid regex" in response.json()["detail"]


def test_logs_filter_excludes_raw_dict_missing_field(monkeypatch):
    raw = [
        {"timestamp": 1.0, "source": "master", "level": 20, "message": "ok"},
        {"unknown_field": "no required fields here"},
    ]
    monkeypatch.setattr(subscriber_manager, "get_logs", lambda: list(raw))

    response = client.get("/api/logs?source_regex=master")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) == 1
    assert logs[0]["source"] == "master"
