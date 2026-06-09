"""Mock-based unit tests for the agent interface endpoints:
- GET  /api/schedule/{rid}
- GET  /api/explist/search
- GET  /api/explist/{file:path}/{class_name}/defaults
- POST /api/schedule/submit-and-wait
"""

import json
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from artiq_http.artiq_api.models import ExperimentEntry, ExperimentList
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
# POST /api/schedule?wait_for_completion=true
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
    response = client.post("/api/schedule?wait_for_completion=true&timeout=60", json=EXPID_PAYLOAD)
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
    response = client.post("/api/schedule?wait_for_completion=true&timeout=2", json=EXPID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 99
    assert data["status"] == "timeout"
    assert data["timed_out"] is True


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_and_wait_clamps_timeout(mock_submit, mock_schedule, mock_sleep):
    """submit-and-wait clamps an over-large timeout to max 21600 and still returns."""
    mock_submit.return_value = 77
    # RID gone immediately
    mock_schedule.return_value = {}
    response = client.post("/api/schedule?wait_for_completion=true&timeout=99999", json=EXPID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 77
    # With the RID never appearing, it should complete after the appearance
    # grace period regardless of the clamped timeout.
    assert data["status"] == "completed"
    assert data["timed_out"] is False


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_and_wait_waits_for_subscriber_lag(mock_submit, mock_schedule, mock_sleep):
    """submit-and-wait must not return early due to schedule subscriber lag.

    The schedule is mirrored from the ARTIQ master by an asynchronous
    subscriber, so the freshly submitted RID may be absent from the very first
    snapshot taken right after submit() returns. The endpoint must wait for the
    RID to appear and only report 'completed' once it has actually left the
    schedule again - not treat the initial absence as completion.
    """
    mock_submit.return_value = 42
    running_entry = {
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
    }
    mock_schedule.side_effect = [
        {},  # poll 1: subscriber lag - RID not registered yet
        running_entry,  # poll 2: experiment now visible, running
        running_entry,  # poll 3: still running
        {},  # poll 4: finished -> genuinely completed
    ]
    response = client.post("/api/schedule?wait_for_completion=true&timeout=60", json=EXPID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 42
    assert data["status"] == "completed"
    assert data["timed_out"] is False
    # It must have observed the experiment running before reporting completion,
    # rather than returning on the first (lagging) empty snapshot.
    assert mock_schedule.call_count >= 4


# ---------------------------------------------------------------------------
# NDScan validation tests
# ---------------------------------------------------------------------------


def _make_ndscan_params(scan_axes, overrides=None, num_repeats=1):
    """Build an ndscan_params value for testing, in ndscan's real wire format.

    Each axis is given the required ``path`` and a default ``randomise_order``,
    and flat ``{fqn: value}`` overrides are wrapped into ``{fqn: [{"path","value"}]}``.
    Returned as the arginfo-style triple (the validator tolerates both that and a
    bare string). Axes are otherwise passed through verbatim so tests can inject
    deliberately-bad ``type``/``range`` values.
    """
    wire_axes = []
    for ax in scan_axes:
        ax = dict(ax)
        ax.setdefault("path", "")
        if isinstance(ax.get("range"), dict):
            ax["range"] = {"randomise_order": False, **ax["range"]}
        wire_axes.append(ax)
    wire_overrides = {fqn: [{"path": "", "value": v}] for fqn, v in (overrides or {}).items()}
    data = {
        "overrides": wire_overrides,
        "scan": {
            "axes": wire_axes,
            "num_repeats": num_repeats,
            "no_axes_mode": "single",
            "randomise_order_globally": False,
        },
    }
    return [{"ty": "PYONValue", "default": json.dumps(data)}, None, None]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_valid(mock_submit, mock_get_explist):
    """Valid ndscan_params passes validation and submits."""
    mock_submit.return_value = 1
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [
                    {
                        "fqn": "test.frequency",
                        "type": "linear",
                        "range": {"start": 0.0, "stop": 100.0, "num_points": 10},
                    }
                ]
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 200
    assert response.json() == 1


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_invalid_json(mock_submit, mock_get_explist):
    """Malformed JSON in ndscan_params returns 422."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {"ndscan_params": [{"ty": "PYONValue", "default": "not json"}, None, None]},
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "JSON parse error" in response.json()["detail"]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_missing_required_keys(mock_submit, mock_get_explist):
    """Missing required keys in ndscan_params returns 422."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {"ndscan_params": [{"ty": "PYONValue", "default": "{}"}, None, None]},
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "missing required key" in response.json()["detail"]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_unknown_scan_type(mock_submit, mock_get_explist):
    """Unknown scan type returns 422."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [{"fqn": "test.frequency", "type": "BadScan", "range": {"start": 0.0, "stop": 100.0, "num_points": 10}}]
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "invalid scan type" in response.json()["detail"]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_unknown_fqn(mock_submit, mock_get_explist):
    """Scan axis referencing unknown FQN returns 422."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [
                    {
                        "fqn": "test.unknown",
                        "type": "linear",
                        "range": {"start": 0.0, "stop": 100.0, "num_points": 10},
                    }
                ]
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "unknown parameter" in response.json()["detail"]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_overlap(mock_submit, mock_get_explist):
    """Parameter both scanned and in overrides returns 422."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [
                    {
                        "fqn": "test.frequency",
                        "type": "linear",
                        "range": {"start": 0.0, "stop": 100.0, "num_points": 10},
                    }
                ],
                overrides={"test.frequency": 50.0},
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "both scanned and fixed" in response.json()["detail"]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_start_eq_stop(mock_submit, mock_get_explist):
    """A degenerate linear scan (start == stop) returns 422.

    Note start > stop is *legal* in ndscan (linspace just descends), so only the
    equal case is rejected as degenerate."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [
                    {
                        "fqn": "test.frequency",
                        "type": "linear",
                        "range": {"start": 100.0, "stop": 100.0, "num_points": 10},
                    }
                ]
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "must differ" in response.json()["detail"]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_num_points_zero(mock_submit, mock_get_explist):
    """num_points <= 0 returns 422."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [
                    {
                        "fqn": "test.frequency",
                        "type": "linear",
                        "range": {"start": 0.0, "stop": 100.0, "num_points": 0},
                    }
                ]
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "must be greater than 0" in response.json()["detail"]


@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_non_ndscan_unaffected(mock_submit):
    """Non-ndscan experiments submit without ndscan validation."""
    mock_submit.return_value = 42
    payload = {
        "log_level": 30,
        "file": "simple_exp.py",
        "class_name": "SimpleExp",
        "arguments": {"count": 5},
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 200
    assert response.json() == 42


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_listscan_valid(mock_submit, mock_get_explist):
    """A list scan with a valid values list passes."""
    mock_submit.return_value = 1
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [{"fqn": "test.frequency", "type": "list", "range": {"values": [1.0, 2.0, 3.0]}}]
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 200


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_ndscan_listscan_empty_values(mock_submit, mock_get_explist):
    """A list scan with empty values returns 422."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params([{"fqn": "test.frequency", "type": "list", "range": {"values": []}}])
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule", json=payload)
    assert response.status_code == 422
    assert "non-empty" in response.json()["detail"]


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_and_wait_ndscan_validation(mock_submit, mock_get_explist):
    """wait_for_completion submission also runs ndscan validation."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    payload = {
        "log_level": 30,
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "arguments": {
            "ndscan_params": _make_ndscan_params(
                [
                    {
                        "fqn": "test.frequency",
                        "type": "linear",
                        "range": {"start": 0.0, "stop": 100.0, "num_points": 0},
                    }
                ]
            )
        },
        "repo_rev": None,
    }
    response = client.post("/api/schedule?wait_for_completion=true", json=payload)
    assert response.status_code == 422
    assert "must be greater than 0" in response.json()["detail"]


# ---------------------------------------------------------------------------
# POST /api/scan — high-level scan submission
# ---------------------------------------------------------------------------

SCAN_REQUEST_1D = {
    "file": "ndscan_exp.py",
    "class_name": "NDScanExp",
    "axes": [
        {
            "fqn": "test.frequency",
            "type": "linear",
            "range": {"start": 0.0, "stop": 100.0, "num_points": 10},
        }
    ],
    "fixed_params": {"test.amplitude": 0.5},
    "num_repeats": 1,
}

SCAN_REQUEST_MULTI = {
    "file": "ndscan_exp.py",
    "class_name": "NDScanExp",
    "axes": [
        {
            "fqn": "test.frequency",
            "type": "linear",
            "range": {"start": 0.0, "stop": 100.0, "num_points": 10},
        },
        {
            "fqn": "test.amplitude",
            "type": "linear",
            "range": {"start": 0.1, "stop": 1.0, "num_points": 5},
        },
    ],
    "num_repeats": 2,
}


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_1d_valid(mock_submit, mock_builder_explist, mock_api_explist):
    """POST /api/scan with a valid 1D LinearScan returns 200 and a RID."""
    mock_submit.return_value = 55
    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_builder_explist.return_value = explist
    mock_api_explist.return_value = explist
    response = client.post("/api/scan", json=SCAN_REQUEST_1D)
    assert response.status_code == 200
    assert response.json() == 55
    mock_submit.assert_called_once()


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_multi_axis_valid(mock_submit, mock_builder_explist, mock_api_explist):
    """POST /api/scan with a valid multi-axis scan returns 200 and a RID."""
    mock_submit.return_value = 56
    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_builder_explist.return_value = explist
    mock_api_explist.return_value = explist
    response = client.post("/api/scan", json=SCAN_REQUEST_MULTI)
    assert response.status_code == 200
    assert response.json() == 56


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_listscan_valid(mock_submit, mock_builder_explist, mock_api_explist):
    """POST /api/scan with a valid ListScan returns 200."""
    mock_submit.return_value = 57
    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_builder_explist.return_value = explist
    mock_api_explist.return_value = explist
    payload = {
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "axes": [{"fqn": "test.frequency", "type": "list", "range": {"values": [10.0, 20.0, 30.0]}}],
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 200
    assert response.json() == 57


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_unknown_experiment(mock_submit, mock_builder_explist):
    """POST /api/scan with an unknown experiment returns 404."""
    mock_builder_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[],
    )
    payload = {
        "file": "missing.py",
        "class_name": "Missing",
        "axes": [{"fqn": "x.y", "type": "linear", "range": {"start": 0.0, "stop": 1.0, "num_points": 5}}],
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 404


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_no_ndscan_schemata(mock_submit, mock_builder_explist):
    """POST /api/scan with a non-ndscan experiment returns 422."""
    mock_builder_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**EXPERIMENT_ENTRY)],
    )
    payload = {
        "file": "simple_exp.py",
        "class_name": "SimpleExp",
        "axes": [{"fqn": "x.y", "type": "linear", "range": {"start": 0.0, "stop": 1.0, "num_points": 5}}],
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 422


@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_invalid_scan_type(mock_submit, mock_builder_explist, mock_api_explist):
    """POST /api/scan with an invalid scan type returns 422 after builder+validation."""
    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_builder_explist.return_value = explist
    mock_api_explist.return_value = explist
    payload = {
        "file": "ndscan_exp.py",
        "class_name": "NDScanExp",
        "axes": [{"fqn": "test.frequency", "type": "BadScan", "range": {"start": 0.0, "stop": 100.0, "num_points": 5}}],
    }
    response = client.post("/api/scan", json=payload)
    assert response.status_code == 422
    assert "invalid scan type" in response.json()["detail"]


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_logs", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_and_wait_completes(
    mock_submit, mock_schedule, mock_logs, mock_builder_explist, mock_api_explist, mock_sleep
):
    """submit-and-wait reports completed when the RID leaves the schedule cleanly."""
    mock_submit.return_value = 88
    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_builder_explist.return_value = explist
    mock_api_explist.return_value = explist
    mock_schedule.return_value = {}  # RID gone immediately
    mock_logs.return_value = []  # no failure logged
    response = client.post("/api/scan?wait_for_completion=true", json=SCAN_REQUEST_1D)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 88
    assert data["status"] == "completed"
    assert data["timed_out"] is False
    assert data["error"] is None


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_logs", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_and_wait_reports_failure(
    mock_submit, mock_schedule, mock_logs, mock_builder_explist, mock_api_explist, mock_sleep
):
    """A RID that vanishes because it CRASHED in prepare is reported as failed.

    This is the regression guard for the original bug: "left the schedule" was
    treated as success, so a prepare-stage crash looked completed.
    """
    mock_submit.return_value = 88
    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_builder_explist.return_value = explist
    mock_api_explist.return_value = explist
    mock_schedule.return_value = {}  # RID gone — but because it died, not finished
    mock_logs.return_value = [
        {
            "timestamp": 1.0,
            "source": "master",
            "level": 40,
            "message": "artiq.master.scheduler:got worker exception in prepare stage, deleting RID 88",
        }
    ]
    response = client.post("/api/scan?wait_for_completion=true", json=SCAN_REQUEST_1D)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 88
    assert data["status"] == "failed"
    assert data["timed_out"] is False
    assert "deleting RID 88" in data["error"]


@patch("artiq_http.api.asyncio.sleep", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_explist", new_callable=AsyncMock)
@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_logs", new_callable=AsyncMock)
@patch("artiq_http.api.api.notifiers.get_schedule", new_callable=AsyncMock)
@patch("artiq_http.api.api.control_schedule.submit_experiment", new_callable=AsyncMock)
def test_submit_scan_and_wait_ignores_debug_deletion(
    mock_submit, mock_schedule, mock_logs, mock_builder_explist, mock_api_explist, mock_sleep
):
    """A normal completion logs "deleting RID <rid>..." at DEBUG and is NOT a failure.

    Regression guard: the scheduler emits a DEBUG "deleting RID <rid>..." line for
    *every* run, including clean ones. Matching that marker regardless of level
    misreported every successful scan as failed; only an ERROR-level log counts.
    """
    mock_submit.return_value = 88
    explist = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
    )
    mock_builder_explist.return_value = explist
    mock_api_explist.return_value = explist
    mock_schedule.return_value = {}  # RID gone because it finished cleanly
    mock_logs.return_value = [
        {
            "timestamp": 1.0,
            "source": "master",
            "level": 10,  # DEBUG — normal scheduler bookkeeping, not a failure
            "message": "artiq.master.scheduler:deleting RID 88...",
        }
    ]
    response = client.post("/api/scan?wait_for_completion=true", json=SCAN_REQUEST_1D)
    assert response.status_code == 200
    data = response.json()
    assert data["rid"] == 88
    assert data["status"] == "completed"
    assert data["timed_out"] is False
    assert data["error"] is None
