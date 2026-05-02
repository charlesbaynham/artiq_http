"""Unit tests for LogBuffer._handle_change normalisation."""

import pytest

from artiq_http.artiq_api.log_buffer import LogBuffer


@pytest.fixture
def log_buffer():
    """Return a LogBuffer that has not started (no network / event loop)."""
    return LogBuffer(host="127.0.0.1", port=3250)


def test_init_populates_buffer_with_normalised_entries(log_buffer):
    """Driving _handle_change with action=init fills the buffer."""
    log_buffer._handle_change(
        {
            "action": "init",
            "struct": [
                (20, "master", 1714000000.0, "started"),
                (30, "scheduler", 1714000001.0, "deferred"),
            ],
        }
    )

    logs = log_buffer.get_logs()
    assert len(logs) == 2

    assert logs[0] == {
        "level": 20,
        "source": "master",
        "timestamp": 1714000000.0,
        "message": "started",
    }
    assert logs[1] == {
        "level": 30,
        "source": "scheduler",
        "timestamp": 1714000001.0,
        "message": "deferred",
    }


def test_append_tuple_adds_normalised_entry(log_buffer):
    """Driving _handle_change with action=append and a 4-tuple appends one entry."""
    log_buffer._handle_change(
        {
            "action": "init",
            "struct": [(20, "master", 1714000000.0, "started")],
        }
    )

    log_buffer._handle_change(
        {
            "action": "append",
            "path": [],
            "x": (40, "master", 1714000002.0, "error"),
        }
    )

    logs = log_buffer.get_logs()
    assert len(logs) == 2
    assert logs[1] == {
        "level": 40,
        "source": "master",
        "timestamp": 1714000002.0,
        "message": "error",
    }


def test_append_dict_passes_through(log_buffer):
    """Driving _handle_change with action=append and a dict appends it unchanged."""
    entry = {"timestamp": 1.0, "source": "x", "level": 10, "message": "y"}

    log_buffer._handle_change(
        {
            "action": "append",
            "path": [],
            "x": entry,
        }
    )

    logs = log_buffer.get_logs()
    assert len(logs) == 1
    assert logs[0] is entry


def test_reinit_clears_prior_entries(log_buffer):
    """A second init replaces the previous buffer contents."""
    log_buffer._handle_change(
        {
            "action": "init",
            "struct": [(20, "master", 1714000000.0, "started")],
        }
    )
    assert len(log_buffer.get_logs()) == 1

    log_buffer._handle_change(
        {
            "action": "init",
            "struct": [(30, "scheduler", 1714000001.0, "deferred")],
        }
    )

    logs = log_buffer.get_logs()
    assert len(logs) == 1
    assert logs[0]["message"] == "deferred"


def test_buffer_respects_maxlen(log_buffer):
    """Appending more than 1000 entries evicts the oldest ones."""
    for i in range(1100):
        log_buffer._handle_change(
            {
                "action": "append",
                "path": [],
                "x": (20, "src", float(i), f"msg-{i}"),
            }
        )

    logs = log_buffer.get_logs()
    assert len(logs) == 1000
    assert logs[0]["message"] == "msg-100"
    assert logs[-1]["message"] == "msg-1099"
