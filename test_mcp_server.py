"""Unit tests for the MCP server tools (no live ARTIQ HTTP backend required).

These exercise the MCP tool functions in ``mcp_server/server.py`` directly,
injecting an :class:`httpx.MockTransport` so we can assert that requests sent to
the FastAPI backend carry the expected parameters. The heavier end-to-end suite
(``test_mcp_tools.py``) connects to a real running MCP server and is gated
behind ``--realserver``.
"""

import json

import httpx

import mcp_server.server as server


def _recording_client(monkeypatch, response_json):
    """Patch ``server._client`` to record the outgoing request and return *response_json*.

    Returns a dict that is populated with 'method', 'url', 'params', and 'json'
    once a tool issues a request.
    """
    captured: dict = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["method"] = request.method
        captured["url"] = request.url
        captured["params"] = dict(request.url.params)
        captured["json"] = json.loads(request.content) if request.content else None
        return httpx.Response(200, json=response_json)

    transport = httpx.MockTransport(handler)

    def fake_client(timeout: float = 30.0) -> httpx.AsyncClient:
        return httpx.AsyncClient(transport=transport, base_url=server.ARTIQ_HTTP_URL, timeout=timeout)

    monkeypatch.setattr(server, "_client", fake_client)
    return captured


async def test_submit_experiment_forwards_repo_rev_due_date_log_level(monkeypatch):
    """submit_experiment puts repo_rev/log_level in the body and due_date in the query."""
    captured = _recording_client(monkeypatch, 42)

    rid = await server.submit_experiment(
        file="idle.py",
        class_name="Idle",
        repo_rev="abc123",
        due_date=123.0,
        log_level=10,
    )

    assert rid == 42
    assert captured["url"].path == "/api/schedule"
    assert captured["json"]["repo_rev"] == "abc123"
    assert captured["json"]["log_level"] == 10
    assert float(captured["params"]["due_date"]) == 123.0


async def test_submit_experiment_omits_unset_optionals(monkeypatch):
    """Unset repo_rev/log_level/due_date are not sent, so the server applies its defaults."""
    captured = _recording_client(monkeypatch, 7)

    await server.submit_experiment(file="idle.py", class_name="Idle")

    assert "repo_rev" not in captured["json"]
    assert "log_level" not in captured["json"]
    assert "due_date" not in captured["params"]


async def test_submit_1d_scan_forwards_due_date(monkeypatch):
    captured = _recording_client(monkeypatch, 5)

    await server.submit_1d_scan(
        file="scans/rabi.py",
        class_name="RabiFlop",
        axis_fqn="rabi.frequency",
        scan_type="linear",
        scan_range={"start": 0.0, "stop": 1.0, "num_points": 3},
        due_date=99.0,
    )

    assert captured["url"].path == "/api/scan"
    assert captured["json"]["due_date"] == 99.0


async def test_submit_1d_scan_omits_unset_due_date(monkeypatch):
    captured = _recording_client(monkeypatch, 5)

    await server.submit_1d_scan(
        file="scans/rabi.py",
        class_name="RabiFlop",
        axis_fqn="rabi.frequency",
        scan_type="linear",
        scan_range={"start": 0.0, "stop": 1.0, "num_points": 3},
    )

    assert "due_date" not in captured["json"]


async def test_submit_1d_scan_forwards_repo_rev(monkeypatch):
    captured = _recording_client(monkeypatch, 5)

    await server.submit_1d_scan(
        file="scans/rabi.py",
        class_name="RabiFlop",
        axis_fqn="rabi.frequency",
        scan_type="linear",
        scan_range={"start": 0.0, "stop": 1.0, "num_points": 3},
        repo_rev="feature-branch",
    )

    assert captured["json"]["repo_rev"] == "feature-branch"


async def test_submit_1d_scan_omits_unset_repo_rev(monkeypatch):
    captured = _recording_client(monkeypatch, 5)

    await server.submit_1d_scan(
        file="scans/rabi.py",
        class_name="RabiFlop",
        axis_fqn="rabi.frequency",
        scan_type="linear",
        scan_range={"start": 0.0, "stop": 1.0, "num_points": 3},
    )

    assert "repo_rev" not in captured["json"]


async def test_submit_multi_axis_scan_forwards_repo_rev(monkeypatch):
    captured = _recording_client(monkeypatch, 6)

    await server.submit_multi_axis_scan(
        file="scans/rabi.py",
        class_name="RabiFlop",
        axes=[{"fqn": "rabi.frequency", "type": "linear", "range": {"start": 0.0, "stop": 1.0, "num_points": 3}}],
        repo_rev="feature-branch",
    )

    assert captured["json"]["repo_rev"] == "feature-branch"


async def test_submit_multi_axis_scan_forwards_due_date(monkeypatch):
    captured = _recording_client(monkeypatch, 6)

    await server.submit_multi_axis_scan(
        file="scans/rabi.py",
        class_name="RabiFlop",
        axes=[{"fqn": "rabi.frequency", "type": "linear", "range": {"start": 0.0, "stop": 1.0, "num_points": 3}}],
        due_date=88.0,
    )

    assert captured["url"].path == "/api/scan"
    assert captured["json"]["due_date"] == 88.0


async def test_get_schedule_item(monkeypatch):
    captured = _recording_client(monkeypatch, {"status": "running", "pipeline": "main"})

    result = await server.get_schedule_item(42)

    assert result == {"status": "running", "pipeline": "main"}
    assert captured["method"] == "GET"
    assert captured["url"].path == "/api/schedule/42"


async def test_get_devices(monkeypatch):
    captured = _recording_client(monkeypatch, {"core": {"type": "local"}})

    result = await server.get_devices()

    assert result == {"core": {"type": "local"}}
    assert captured["method"] == "GET"
    assert captured["url"].path == "/api/devices"
