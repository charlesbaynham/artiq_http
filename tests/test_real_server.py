import json
from pathlib import Path

import httpx
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


def test_recompute_arginfo(client):
    """POST /explist/{file}/{class_name}/recompute re-examines on the master and
    returns arginfo matching the statically-scanned current revision."""
    explist = client.get("/api/explist?fields=file,class_name").json()["experiments"]
    assert explist, "no experiments discovered on the real server"
    exp = explist[0]

    static = client.get(f"/api/explist/{exp['file']}/{exp['class_name']}/arginfo")
    assert static.status_code == 200

    # revision omitted -> examine at the master's current revision.
    recomputed = client.post(f"/api/explist/{exp['file']}/{exp['class_name']}/recompute")
    assert recomputed.status_code == 200, recomputed.text
    data = recomputed.json()
    assert data["file"] == exp["file"]
    assert data["class_name"] == exp["class_name"]
    assert isinstance(data["arginfo"], dict)
    # The examined argument set should match the static scan's argument set.
    assert set(data["arginfo"].keys()) == set(static.json()["arginfo"].keys())


def _get_ndscan_experiment(client) -> dict:
    response = client.get("/api/explist?fields=file,class_name,arginfo&full=true")
    assert response.status_code == 200

    experiments = response.json()["experiments"]
    for experiment in experiments:
        arginfo = experiment.get("arginfo") or {}
        if "ndscan_params" not in arginfo:
            continue

        schemata = json.loads(arginfo["ndscan_params"][0]["default"])["schemata"]
        if any(key.endswith(".frequency") for key in schemata) and any(key.endswith(".amplitude") for key in schemata):
            return experiment

    pytest.skip("No suitable ndscan experiment with frequency/amplitude parameters available")


def _build_ndscan_arguments(arginfo: dict) -> dict:
    ndscan_params = json.loads(arginfo["ndscan_params"][0]["default"])
    schemata = ndscan_params["schemata"]

    fqn_to_path = {}
    for path, fqns in ndscan_params["instances"].items():
        for fqn in fqns:
            fqn_to_path.setdefault(fqn, path)

    def find_fqn(param_name: str) -> str:
        for fqn in schemata:
            if fqn.endswith(f".{param_name}"):
                return fqn
        raise AssertionError(f"Missing ndscan parameter: {param_name}")

    overrides = {}
    for param_name, value in {
        "frequency": 25_000_000.0,
        "amplitude": 0.8,
        "enable_noise": False,
    }.items():
        fqn = find_fqn(param_name)
        overrides[fqn] = [{"path": fqn_to_path.get(fqn, ""), "value": value}]

    ndscan_params["overrides"] = overrides
    return {"ndscan_params": json.dumps(ndscan_params)}


def _collect_sse_events(prefix: str, timeout: float = 60.0) -> tuple[httpx.Headers, list[dict], dict]:
    events = []
    state = {}

    with httpx.Client(timeout=timeout) as http_client:
        with http_client.stream("GET", f"http://localhost:8000/api/datasets/stream/{prefix}") as response:
            current_event = None
            data_lines = []

            for line in response.iter_lines():
                if not line:
                    if current_event is None:
                        continue

                    payload = json.loads("\n".join(data_lines)) if data_lines else None
                    events.append({"event": current_event, "data": payload})

                    if current_event in {"init", "update"} and isinstance(payload, dict):
                        state.update(payload)

                    if current_event == "delete" and isinstance(payload, dict) and payload.get("key"):
                        state.pop(payload["key"], None)

                    signal_key = f"{prefix}.point.signal"
                    completed_key = f"{prefix}.completed"
                    if signal_key in state and completed_key in state and state[completed_key][1] is True:
                        return response.headers, events, state

                    current_event = None
                    data_lines = []
                    continue

                if line.startswith("event: "):
                    current_event = line.removeprefix("event: ")
                elif line.startswith("data: "):
                    data_lines.append(line.removeprefix("data: "))

    return response.headers, events, state


def test_datasets_stream_collects_real_ndscan_data(client):
    """Submit a real ndscan experiment and verify SSE exposes its signal datasets."""
    health_response = client.get("/api/health")
    assert health_response.status_code == 200
    assert health_response.json()["artiq_connected"] is True

    experiment = _get_ndscan_experiment(client)
    arguments = _build_ndscan_arguments(experiment["arginfo"])

    submit_response = client.post(
        "/api/schedule",
        json={
            "log_level": 30,
            "file": experiment["file"],
            "class_name": experiment["class_name"],
            "arguments": arguments,
            "repo_rev": "repository",
        },
    )
    assert submit_response.status_code == 200
    rid = submit_response.json()

    prefix = f"ndscan.rid_{rid}"
    headers, events, state = _collect_sse_events(prefix)

    LOG_DIR.mkdir(exist_ok=True)
    (LOG_DIR / "sse_ndscan_events_debug.json").write_text(json.dumps(events, indent=2))
    (LOG_DIR / "sse_ndscan_state_debug.json").write_text(json.dumps(state, indent=2))

    assert headers["content-type"].startswith("text/event-stream")
    assert headers["cache-control"] == "no-cache"
    assert headers["connection"] == "keep-alive"
    assert headers["x-accel-buffering"] == "no"

    signal_key = f"{prefix}.point.signal"
    completed_key = f"{prefix}.completed"
    channels_key = f"{prefix}.channels"

    assert any(event["event"] == "init" for event in events)
    assert signal_key in state
    assert channels_key in state
    assert completed_key in state
    assert state[completed_key][1] is True
    assert isinstance(state[signal_key][1], (int, float))
    assert abs(state[signal_key][1] - 0.8) < 1e-6
