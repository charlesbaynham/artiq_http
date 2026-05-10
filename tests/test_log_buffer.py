"""Unit tests for LogBuffer._handle_message normalisation."""

import pytest

from artiq_http.artiq_api.log_buffer import LogBuffer


@pytest.fixture
def log_buffer():
    """Return a LogBuffer that has not started (no network / event loop)."""
    return LogBuffer(host="127.0.0.1", port=1067)


def test_tuple_message_appends_normalised_entry(log_buffer):
    """A 4-tuple broadcast message is normalised into a dict and appended."""
    log_buffer._handle_message((20, "master", 1714000000.0, "started"))

    logs = log_buffer.get_logs()
    assert len(logs) == 1
    assert logs[0] == {
        "level": 20,
        "source": "master",
        "timestamp": 1714000000.0,
        "message": "started",
    }


def test_list_message_is_also_accepted(log_buffer):
    """A 4-element list is treated identically to a 4-tuple."""
    log_buffer._handle_message([40, "master", 1714000002.0, "error"])

    logs = log_buffer.get_logs()
    assert len(logs) == 1
    assert logs[0]["level"] == 40
    assert logs[0]["message"] == "error"


def test_dict_message_passes_through(log_buffer):
    """A dict message is appended unchanged."""
    entry = {"timestamp": 1.0, "source": "x", "level": 10, "message": "y"}

    log_buffer._handle_message(entry)

    logs = log_buffer.get_logs()
    assert len(logs) == 1
    assert logs[0] is entry


def test_malformed_message_is_dropped(log_buffer):
    """Messages that don't match a 4-tuple or dict are silently dropped."""
    log_buffer._handle_message("not-a-log-entry")
    log_buffer._handle_message((1, 2, 3))  # wrong arity
    log_buffer._handle_message(None)

    assert log_buffer.get_logs() == []


def test_buffer_respects_maxlen(log_buffer):
    """Appending more than 1000 entries evicts the oldest ones."""
    for i in range(1100):
        log_buffer._handle_message((20, "src", float(i), f"msg-{i}"))

    logs = log_buffer.get_logs()
    assert len(logs) == 1000
    assert logs[0]["message"] == "msg-100"
    assert logs[-1]["message"] == "msg-1099"
