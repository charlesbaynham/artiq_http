"""Unit tests for the mock backend (artiq_http/mock_backend.py)."""

import asyncio
import json

import pytest
from fastapi.testclient import TestClient

# ── Helpers ──────────────────────────────────────────────────────────────────


def run_async(coro):
    return asyncio.run(coro)


# ── MockDatasetsSubscriber ────────────────────────────────────────────────────


def test_mock_datasets_subscriber_initial_state():
    from artiq_http.mock_backend import MockDatasetsSubscriber

    sub = MockDatasetsSubscriber()
    assert sub.is_connected() is True
    assert sub.get_data() == {}


def test_mock_datasets_subscriber_callback_registration():
    from artiq_http.mock_backend import MockDatasetsSubscriber

    sub = MockDatasetsSubscriber()
    received = []

    def cb(mod):
        received.append(mod)

    sub.register_change_callback(cb)
    sub._set_and_notify("key1", [False, 42, {}])

    assert len(received) == 1
    assert received[0] == {"action": "setitem", "key": "key1", "path": []}
    assert sub.get_data()["key1"] == [False, 42, {}]


def test_mock_datasets_subscriber_no_duplicate_callbacks():
    from artiq_http.mock_backend import MockDatasetsSubscriber

    sub = MockDatasetsSubscriber()
    received = []

    def cb(mod):
        received.append(mod)

    sub.register_change_callback(cb)
    sub.register_change_callback(cb)  # duplicate
    sub._set_and_notify("k", 1)

    assert len(received) == 1


def test_mock_datasets_subscriber_unregister_callback():
    from artiq_http.mock_backend import MockDatasetsSubscriber

    sub = MockDatasetsSubscriber()
    received = []

    def cb(mod):
        received.append(mod)

    sub.register_change_callback(cb)
    sub.unregister_change_callback(cb)
    sub._set_and_notify("k", 1)

    assert received == []


def test_mock_datasets_subscriber_get_data_returns_copy():
    from artiq_http.mock_backend import MockDatasetsSubscriber

    sub = MockDatasetsSubscriber()
    sub._set_and_notify("k", [False, 1, {}])
    d1 = sub.get_data()
    d2 = sub.get_data()
    assert d1 == d2
    d1["extra"] = True
    assert "extra" not in sub.get_data()


# ── MockSubscriberManager lifecycle ──────────────────────────────────────────


def test_mock_manager_wait_for_init():
    from artiq_http.mock_backend import MockSubscriberManager

    mgr = MockSubscriberManager()
    assert run_async(mgr.wait_for_init()) is True
    assert run_async(mgr.wait_for_init(timeout=0)) is True


def test_mock_manager_start_seeds_datasets():
    from artiq_http.mock_backend import _PREFIX, MockSubscriberManager

    async def go():
        mgr = MockSubscriberManager()
        await mgr.start()
        data = mgr.get_datasets()
        await mgr.stop()
        return data

    data = run_async(go())

    assert f"{_PREFIX}.axes" in data
    assert f"{_PREFIX}.channels" in data
    assert f"{_PREFIX}.fragment_fqn" in data
    assert f"{_PREFIX}.completed" in data
    for ch in ("ch0", "ch1", "ch2", "ch3"):
        assert f"{_PREFIX}.point.{ch}" in data


def test_mock_manager_axes_is_empty_json_array():
    from artiq_http.mock_backend import _PREFIX, MockSubscriberManager

    async def go():
        mgr = MockSubscriberManager()
        await mgr.start()
        axes_entry = mgr.get_datasets()[f"{_PREFIX}.axes"]
        await mgr.stop()
        return axes_entry

    axes_entry = run_async(go())
    assert axes_entry[0] is False
    assert json.loads(axes_entry[1]) == []


def test_mock_manager_channels_has_four_entries():
    from artiq_http.mock_backend import _PREFIX, MockSubscriberManager

    async def go():
        mgr = MockSubscriberManager()
        await mgr.start()
        ch_entry = mgr.get_datasets()[f"{_PREFIX}.channels"]
        await mgr.stop()
        return ch_entry

    ch_entry = run_async(go())
    channels = json.loads(ch_entry[1])
    assert len(channels) == 4
    for key, spec in channels.items():
        assert spec["type"] == "float"
        assert "description" in spec


def test_mock_manager_point_values_are_floats():
    from artiq_http.mock_backend import _PREFIX, MockSubscriberManager

    async def go():
        mgr = MockSubscriberManager()
        await mgr.start()
        data = mgr.get_datasets()
        await mgr.stop()
        return data

    data = run_async(go())
    for ch in ("ch0", "ch1", "ch2", "ch3"):
        entry = data[f"{_PREFIX}.point.{ch}"]
        assert isinstance(entry[1], float)


def test_mock_manager_update_loop_fires_callbacks():
    from artiq_http.mock_backend import MockSubscriberManager

    async def go():
        mgr = MockSubscriberManager()
        await mgr.start()

        updates = []
        mgr.get_datasets_subscriber().register_change_callback(lambda mod: updates.append(mod["key"]))

        await asyncio.sleep(0.6)
        await mgr.stop()
        return updates

    updates = run_async(go())
    # At least one full set of four channel updates should have arrived
    assert len(updates) >= 4
    for ch in ("ch0", "ch1", "ch2", "ch3"):
        assert any(ch in k for k in updates)


def test_mock_manager_double_start_is_safe():
    from artiq_http.mock_backend import MockSubscriberManager

    async def go():
        mgr = MockSubscriberManager()
        await mgr.start()
        await mgr.start()  # should not raise or create a second task
        await mgr.stop()

    run_async(go())


def test_mock_manager_stop_without_start_is_safe():
    from artiq_http.mock_backend import MockSubscriberManager

    run_async(MockSubscriberManager().stop())


# ── SubscriberManager interface ───────────────────────────────────────────────


def test_mock_manager_get_schedule_returns_empty():
    from artiq_http.mock_backend import MockSubscriberManager

    assert MockSubscriberManager().get_schedule() == {}


def test_mock_manager_get_logs_returns_empty():
    from artiq_http.mock_backend import MockSubscriberManager

    assert MockSubscriberManager().get_logs() == []


def test_mock_manager_get_explist_structure():
    from artiq_http.mock_backend import MockSubscriberManager

    explist = MockSubscriberManager().get_explist()
    assert len(explist) == 2
    assert set(explist) == {"MockRepeatExperiment", "MockFreqScan"}
    for entry in explist.values():
        assert "file" in entry
        assert "class_name" in entry


def test_mock_manager_get_explist_status():
    from artiq_http.mock_backend import MockSubscriberManager

    status = MockSubscriberManager().get_explist_status()
    assert status["scanning"] is False
    assert "cur_rev" in status


def test_mock_manager_subscribers_all_connected():
    from artiq_http.mock_backend import MockSubscriberManager

    mgr = MockSubscriberManager()
    for name, sub in mgr._subscribers.items():
        assert sub.is_connected() is True, f"{name} not connected"


# ── Full-stack API tests in mock mode ─────────────────────────────────────────


@pytest.fixture(scope="module")
def mock_client():
    """TestClient with mock mode enabled."""
    from artiq_http.api import app
    from artiq_http.config import config

    original = config.get("mock", False)
    config["mock"] = True
    try:
        with TestClient(app) as client:
            yield client
    finally:
        config["mock"] = original


def test_health_healthy_in_mock_mode(mock_client):
    r = mock_client.get("/api/health")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "healthy"
    assert data["artiq_connected"] is True
    for key in ("explist", "explist_status", "schedule", "datasets", "logs"):
        assert data["details"][key] is True


def test_dataset_names_include_ndscan_prefix(mock_client):
    r = mock_client.get("/api/datasets/names")
    assert r.status_code == 200
    names = r.json()["names"]
    ndscan = [n for n in names if n.startswith("ndscan.rid_")]
    assert len(ndscan) >= 4  # at least axes, channels, fragment_fqn, completed


def test_dataset_values_returns_axes_and_channels(mock_client):
    r = mock_client.get("/api/datasets/values?names=ndscan.rid_1.axes,ndscan.rid_1.channels")
    assert r.status_code == 200
    data = r.json()
    assert "ndscan.rid_1.axes" in data
    assert json.loads(data["ndscan.rid_1.axes"][1]) == []
    assert "ndscan.rid_1.channels" in data
    channels = json.loads(data["ndscan.rid_1.channels"][1])
    assert len(channels) == 4


def test_explist_returns_mock_experiment(mock_client):
    r = mock_client.get("/api/explist")
    assert r.status_code == 200
    data = r.json()
    assert data["scanning"] is False
    class_names = {exp["class_name"] for exp in data["experiments"]}
    assert class_names == {"MockRepeatExperiment", "MockFreqScan"}
    assert data["default_revision_fallback"] == data["current_rev"]


def test_schedule_empty_in_mock_mode(mock_client):
    r = mock_client.get("/api/schedule")
    assert r.status_code == 200
    assert r.json() == {}


def test_submit_returns_503_in_mock_mode(mock_client):
    r = mock_client.post(
        "/api/schedule",
        json={"file": "x.py", "class_name": "X", "arguments": {}},
    )
    assert r.status_code == 503


def test_cancel_returns_503_in_mock_mode(mock_client):
    r = mock_client.post("/api/cancel?rid=1")
    assert r.status_code == 503


def test_recompute_returns_mock_arginfo(mock_client):
    r = mock_client.post(
        "/api/explist/mock_experiment.py/MockRepeatExperiment/recompute",
        params={"revision": "some-branch"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["file"] == "mock_experiment.py"
    assert data["class_name"] == "MockRepeatExperiment"
    assert data["arginfo"] == {}


def test_recompute_unknown_experiment_returns_404(mock_client):
    r = mock_client.post("/api/explist/mock_experiment.py/Nope/recompute")
    assert r.status_code == 404


def test_defaults_at_revision_returns_mock_defaults(mock_client):
    """GET .../defaults?revision=X examines (mock: revision ignored) and extracts defaults."""
    r = mock_client.get(
        "/api/explist/mock_experiment.py/MockRepeatExperiment/defaults",
        params={"revision": "some-branch"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["file"] == "mock_experiment.py"
    assert data["class_name"] == "MockRepeatExperiment"
    assert isinstance(data["arguments"], dict)


def test_defaults_at_revision_unknown_experiment_returns_404(mock_client):
    r = mock_client.get(
        "/api/explist/mock_experiment.py/Nope/defaults",
        params={"revision": "some-branch"},
    )
    assert r.status_code == 404


def test_mock_mode_restores_subscriber_manager():
    """Mock mode must not leak its MockSubscriberManager into the process-wide
    singleton; otherwise realserver test modules collected later inherit mock data."""
    from artiq_http import artiq_api
    from artiq_http.api import app
    from artiq_http.config import config

    original = artiq_api.persistent_subscriber.subscriber_manager
    prev_mock = config.get("mock", False)
    config["mock"] = True
    try:
        with TestClient(app):
            # Inside mock mode the singleton is swapped for the mock manager.
            assert artiq_api.persistent_subscriber.subscriber_manager is not original
        # On teardown the original singleton must be restored.
        assert artiq_api.persistent_subscriber.subscriber_manager is original
    finally:
        config["mock"] = prev_mock
        artiq_api.persistent_subscriber.subscriber_manager = original


def test_recompute_extracts_class_arginfo(monkeypatch):
    """Outside mock mode the endpoint extracts the requested class from the
    description returned by experiment_db.examine and 404s when it is absent."""
    import asyncio

    from artiq_http import api as api_module
    from artiq_http.config import config

    fake_arginfo = {"freq": [{"ty": "NumberValue", "default": 1.0}, "RF", None]}

    async def fake_examine(filename, revision=None):
        assert filename == "scans/rabi.py"
        assert revision == "feature-branch"
        return {"RabiFlop": {"arginfo": fake_arginfo}, "Other": {"arginfo": {}}}

    monkeypatch.setitem(config, "mock", False)
    monkeypatch.setattr(api_module.api.control_schedule, "examine_experiment", fake_examine)

    result = asyncio.run(api_module.recompute_explist_arginfo("scans/rabi.py", "RabiFlop", "feature-branch"))
    assert result.arginfo == fake_arginfo

    from fastapi import HTTPException

    with pytest.raises(HTTPException) as exc:
        asyncio.run(api_module.recompute_explist_arginfo("scans/rabi.py", "Missing", "feature-branch"))
    assert exc.value.status_code == 404
