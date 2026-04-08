"""Mock-based unit tests for the agent interface endpoints:
- GET  /api/schedule/{rid}
- GET  /api/explist/search
- GET  /api/explist/{file:path}/{class_name}/defaults
- POST /api/schedule/submit-and-wait
"""

from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from artiq_http.main import fastapi_app

client = TestClient(fastapi_app)

# ---------------------------------------------------------------------------
# Shared test data
# ---------------------------------------------------------------------------

SCHEDULE_ITEM = {
    "pipeline": "main",
    "priority": 0,
    "status": "running",
    "due_date": None,
    "flush": False,
    "repo_msg": None,
    "expid": {
        "log_level": 30,
        "file": "simple_exp.py",
        "class_name": "SimpleExp",
        "arguments": {},
        "repo_rev": None,
    },
}

ARGINFO = {
    "count": [
        "NumberValue",
        {"default": 10, "unit": "", "scale": 1, "step": 1, "min": None, "max": None, "ndecimals": 0},
        None,
        None,
    ],
    "name": ["StringValue", {"default": "hello"}, None, None],
    "flag": ["BooleanValue", {"default": True}, None, None],
}

# NDScan experiment arginfo - parameters are in ndscan_params, not in regular arginfo
NDSCAN_ARGINFO = {
    "ndscan_params": [
        {
            "ty": "PYONValue",
            "default": '{"instances":{"":["test.frequency","test.amplitude"]},"schemata":{"test.frequency":{"fqn":"test.frequency","description":"Frequency","type":"float","default":"100.0","spec":{"is_scannable":true,"unit":"MHz"}},"test.amplitude":{"fqn":"test.amplitude","description":"Amplitude","type":"float","default":"0.5","spec":{"is_scannable":true,"unit":"V"}}},"always_shown":[],"overrides":{},"scan":{"axes":[],"num_repeats":1}}',
        },
        None,
        None,
    ]
}

NDSCAN_EXPERIMENT_ENTRY = {
    "name": "NDScan Experiment",
    "file": "ndscan_exp.py",
    "class_name": "NDScanExp",
    "arginfo": NDSCAN_ARGINFO,
    "argument_ui": None,
    "scheduler_defaults": {},
}

EXPERIMENT_ENTRY = {
    "name": "Simple Experiment",
    "file": "simple_exp.py",
    "class_name": "SimpleExp",
    "arginfo": ARGINFO,
    "argument_ui": None,
    "scheduler_defaults": {},
}

EXPLIST_WITH_ONE = {
    "current_rev": "abc123",
    "scanning": False,
    "experiments": [EXPERIMENT_ENTRY],
}


# ---------------------------------------------------------------------------
# GET /api/schedule/{rid}
# ---------------------------------------------------------------------------


@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
def test_get_schedule_by_rid_found(mock_get_schedule):
    """GET /api/schedule/123 returns 200 when RID is present in schedule."""
    mock_get_schedule.return_value = {123: SCHEDULE_ITEM}
    response = client.get("/api/schedule/123")
    assert response.status_code == 200
    data = response.json()
    assert data["pipeline"] == "main"
    assert data["status"] == "running"


@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
def test_get_schedule_by_rid_not_found(mock_get_schedule):
    """GET /api/schedule/999 returns 404 when RID is absent from schedule."""
    mock_get_schedule.return_value = {}
    response = client.get("/api/schedule/999")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# GET /api/explist/search
# ---------------------------------------------------------------------------


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
def test_explist_search_found(mock_get_explist):
    """GET /api/explist/search?q=simple returns the matching experiment."""
    from artiq_http.artiq_api.models import ExperimentEntry, ExperimentList

    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**EXPERIMENT_ENTRY)],
    )
    mock_get_explist.return_value = explist
    response = client.get("/api/explist/search?q=simple")
    assert response.status_code == 200
    data = response.json()
    assert len(data["experiments"]) == 1
    assert data["experiments"][0]["class_name"] == "SimpleExp"


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
def test_explist_search_no_match(mock_get_explist):
    """GET /api/explist/search?q=zzznomatch returns an empty experiments list."""
    from artiq_http.artiq_api.models import ExperimentEntry, ExperimentList

    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**EXPERIMENT_ENTRY)],
    )
    mock_get_explist.return_value = explist
    response = client.get("/api/explist/search?q=zzznomatch")
    assert response.status_code == 200
    data = response.json()
    assert len(data["experiments"]) == 0


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
def test_explist_search_case_insensitive(mock_get_explist):
    """GET /api/explist/search?q=SIMPLE matches despite different case."""
    from artiq_http.artiq_api.models import ExperimentEntry, ExperimentList

    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**EXPERIMENT_ENTRY)],
    )
    mock_get_explist.return_value = explist
    response = client.get("/api/explist/search?q=SIMPLE")
    assert response.status_code == 200
    data = response.json()
    assert len(data["experiments"]) == 1


# ---------------------------------------------------------------------------
# GET /api/explist/{file:path}/{class_name}/defaults
# ---------------------------------------------------------------------------


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
def test_explist_defaults_found(mock_get_explist):
    """GET /api/explist/simple_exp.py/SimpleExp/defaults returns argument defaults."""
    from artiq_http.artiq_api.models import ExperimentEntry, ExperimentList

    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**EXPERIMENT_ENTRY)],
    )
    mock_get_explist.return_value = explist
    response = client.get("/api/explist/simple_exp.py/SimpleExp/defaults")
    assert response.status_code == 200
    data = response.json()
    assert data["file"] == "simple_exp.py"
    assert data["class_name"] == "SimpleExp"
    assert data["arguments"]["count"] == 10
    assert data["arguments"]["name"] == "hello"
    assert data["arguments"]["flag"] is True


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
def test_explist_defaults_not_found(mock_get_explist):
    """GET /api/explist/missing.py/Missing/defaults returns 404 when not found."""
    from artiq_http.artiq_api.models import ExperimentList

    explist = ExperimentList(current_rev="abc123", scanning=False, experiments=[])
    mock_get_explist.return_value = explist
    response = client.get("/api/explist/missing.py/Missing/defaults")
    assert response.status_code == 404


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
def test_explist_defaults_ndscan_experiment(mock_get_explist):
    """GET /api/explist/ndscan_exp.py/NDScanExp/defaults returns ndscan parameter defaults from schemata.

    This test verifies that ndscan experiments (which store params in ndscan_params JSON)
    correctly extract default values from the schemata section.
    """
    from artiq_http.artiq_api.models import ExperimentEntry, ExperimentList

    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_get_explist.return_value = explist
    response = client.get("/api/explist/ndscan_exp.py/NDScanExp/defaults")
    assert response.status_code == 200
    data = response.json()
    assert data["file"] == "ndscan_exp.py"
    assert data["class_name"] == "NDScanExp"
    # NDScan parameters should be extracted from schemata in ndscan_params
    assert "frequency" in data["arguments"], "frequency param should be extracted from ndscan schemata"
    assert "amplitude" in data["arguments"], "amplitude param should be extracted from ndscan schemata"
    assert data["arguments"]["frequency"] == 100.0
    assert data["arguments"]["amplitude"] == 0.5


# ---------------------------------------------------------------------------
# POST /api/schedule/submit-and-wait
# ---------------------------------------------------------------------------

EXPID_PAYLOAD = {
    "log_level": 30,
    "file": "test.py",
    "class_name": "Test",
    "arguments": {},
    "repo_rev": None,
}


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_and_wait_completes(mock_submit, mock_schedule, mock_sleep):
    """submit-and-wait returns status='completed' when RID disappears from schedule."""
    mock_submit.return_value = 42
    mock_schedule.side_effect = [
        {
            42: {
                "pipeline": "main",
                "priority": 0,
                "status": "running",
                "due_date": None,
                "flush": False,
                "repo_msg": None,
                "expid": {
                    "log_level": 30,
                    "file": "test.py",
                    "class_name": "Test",
                    "arguments": {},
                    "repo_rev": None,
                },
            }
        },
        {},  # RID gone on second poll
    ]
    response = client.post("/api/schedule/submit-and-wait?timeout=60", json=EXPID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 42
    assert data["status"] == "completed"
    assert data["timed_out"] is False


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_and_wait_timeout(mock_submit, mock_schedule, mock_sleep):
    """submit-and-wait returns status='timeout' when RID stays in schedule past timeout."""
    mock_submit.return_value = 99
    # RID always present - simulate a 2-second timeout by always returning it
    schedule_entry = {
        99: {
            "pipeline": "main",
            "priority": 0,
            "status": "running",
            "due_date": None,
            "flush": False,
            "repo_msg": None,
            "expid": {
                "log_level": 30,
                "file": "test.py",
                "class_name": "Test",
                "arguments": {},
                "repo_rev": None,
            },
        }
    }
    # Return schedule with RID present enough times to exhaust the timeout
    mock_schedule.return_value = schedule_entry
    response = client.post("/api/schedule/submit-and-wait?timeout=2", json=EXPID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 99
    assert data["status"] == "timeout"
    assert data["timed_out"] is True


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_and_wait_clamps_timeout(mock_submit, mock_schedule, mock_sleep):
    """submit-and-wait clamps timeout=999 to max 300 and still returns a result."""
    mock_submit.return_value = 77
    # RID gone immediately
    mock_schedule.return_value = {}
    response = client.post("/api/schedule/submit-and-wait?timeout=999", json=EXPID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 77
    # With RID gone on first poll, it should complete immediately regardless of clamped timeout
    assert data["status"] == "completed"
    assert data["timed_out"] is False
