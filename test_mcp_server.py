"""Unit tests for the MCP server tools (no live ARTIQ HTTP backend required).

These exercise the MCP tool functions in ``mcp_server/server.py`` directly,
injecting an :class:`httpx.MockTransport` so we can assert that requests sent to
the FastAPI backend carry the expected parameters. The heavier end-to-end suite
(``test_mcp_tools.py``) connects to a real running MCP server and is gated
behind ``--realserver``.
"""

import json

import httpx

from mcp_server import server


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


async def test_get_experiment_defaults_forwards_revision(monkeypatch):
    captured = _recording_client(monkeypatch, {"file": "scans/rabi.py", "class_name": "RabiFlop", "arguments": {}})

    await server.get_experiment_defaults(
        file="scans/rabi.py",
        class_name="RabiFlop",
        revision="feature-branch",
    )

    assert captured["url"].path == "/api/explist/scans/rabi.py/RabiFlop/defaults"
    assert captured["params"]["revision"] == "feature-branch"


async def test_get_experiment_defaults_omits_unset_revision(monkeypatch):
    captured = _recording_client(monkeypatch, {"file": "scans/rabi.py", "class_name": "RabiFlop", "arguments": {}})

    await server.get_experiment_defaults(file="scans/rabi.py", class_name="RabiFlop")

    assert "revision" not in captured["params"]


# A realistically chunky ndscan_params payload — the kind of thing that bloats a
# running scan's schedule entry. Its presence (not its content) is what we assert.
_NDSCAN_PARAMS = json.dumps(
    {
        "instances": {"": ["rabi.frequency"]},
        "schemata": {
            "rabi.frequency": {
                "fqn": "rabi.frequency",
                "description": "Drive frequency",
                "type": "float",
                "default": "100.0",
                "spec": {"is_scannable": True, "unit": "MHz"},
            }
        },
        "always_shown": [],
        "overrides": {},
        "scan": {"axes": [], "num_repeats": 1},
    }
)

_SCAN_SCHEDULE_ITEM = {
    "pipeline": "main",
    "priority": 0,
    "due_date": None,
    "flush": False,
    "status": "running",
    "repo_msg": None,
    "expid": {
        "log_level": 30,
        "file": "scans/rabi.py",
        "class_name": "RabiFlop",
        "arguments": {"ndscan_params": _NDSCAN_PARAMS, "shots": 100},
        "repo_rev": "abc123",
    },
}


async def test_get_schedule_item_compact_drops_ndscan_params(monkeypatch):
    """By default a single schedule item is trimmed: identity kept, bulk dropped."""
    captured = _recording_client(monkeypatch, _SCAN_SCHEDULE_ITEM)

    result = await server.get_schedule_item(42)

    assert captured["method"] == "GET"
    assert captured["url"].path == "/api/schedule/42"
    assert result["status"] == "running"
    assert result["expid"]["file"] == "scans/rabi.py"
    assert result["expid"]["is_scan"] is True
    assert result["expid"]["argument_keys"] == ["shots"]
    # The bulky schemata must not survive into the compact form.
    assert "ndscan_params" not in json.dumps(result)


async def test_get_schedule_item_verbose_returns_full_item(monkeypatch):
    _recording_client(monkeypatch, _SCAN_SCHEDULE_ITEM)

    result = await server.get_schedule_item(42, verbose=True)

    assert result == _SCAN_SCHEDULE_ITEM
    assert "ndscan_params" in json.dumps(result)


async def test_get_schedule_compact_by_default(monkeypatch):
    _recording_client(monkeypatch, {"42": _SCAN_SCHEDULE_ITEM})

    result = await server.get_schedule()

    assert "ndscan_params" not in json.dumps(result)
    assert result["42"]["expid"]["is_scan"] is True
    assert result["42"]["expid"]["argument_keys"] == ["shots"]


async def test_get_schedule_verbose_returns_full_payload(monkeypatch):
    schedule = {"42": _SCAN_SCHEDULE_ITEM}
    _recording_client(monkeypatch, schedule)

    result = await server.get_schedule(verbose=True)

    assert result == schedule
    assert "ndscan_params" in json.dumps(result)


_EXPLIST = {
    "current_rev": "abc123",
    "scanning": False,
    "experiments": [
        {
            "name": "RabiFlop",
            "file": "scans/rabi.py",
            "class_name": "RabiFlop",
            "docstring": "Rabi flopping scan.\n\nDetails that the compact form should drop.",
            "arginfo": {"ndscan_params": ["PYONValue", {"default": _NDSCAN_PARAMS}]},
            "scheduler_defaults": {"priority": 1},
        }
    ],
}


async def test_list_experiments_compact_by_default(monkeypatch):
    captured = _recording_client(monkeypatch, _EXPLIST)

    result = await server.list_experiments()

    # The compact path requests no extra fields (server default excludes arginfo).
    assert "fields" not in captured["params"]
    assert result["experiments"][0] == {
        "name": "RabiFlop",
        "file": "scans/rabi.py",
        "class_name": "RabiFlop",
        "summary": "Rabi flopping scan.",
    }
    assert "ndscan_params" not in json.dumps(result)


async def test_list_experiments_verbose_requests_full_fields(monkeypatch):
    captured = _recording_client(monkeypatch, _EXPLIST)

    result = await server.list_experiments(verbose=True)

    assert "arginfo" in captured["params"]["fields"]
    assert result == _EXPLIST


async def test_search_experiments_compact_and_verbose(monkeypatch):
    captured = _recording_client(monkeypatch, _EXPLIST)

    compact = await server.search_experiments("rabi")
    assert captured["params"]["q"] == "rabi"
    assert "fields" not in captured["params"]
    assert compact["experiments"][0]["summary"] == "Rabi flopping scan."

    verbose = await server.search_experiments("rabi", verbose=True)
    assert "arginfo" in captured["params"]["fields"]
    assert verbose == _EXPLIST


def _recording_batch_client(monkeypatch, rids):
    """Patch ``server._client`` to record EVERY outgoing request and hand back
    successive RIDs from *rids* (one per POST /api/scan).

    Returns the list that accumulates one capture dict per request, each with
    'method', 'url', 'params' and 'json'.
    """
    captured: list[dict] = []
    rid_iter = iter(rids)

    def handler(request: httpx.Request) -> httpx.Response:
        captured.append(
            {
                "method": request.method,
                "url": request.url,
                "params": dict(request.url.params),
                "json": json.loads(request.content) if request.content else None,
            }
        )
        return httpx.Response(200, json=next(rid_iter))

    transport = httpx.MockTransport(handler)

    def fake_client(timeout: float = 30.0) -> httpx.AsyncClient:
        return httpx.AsyncClient(transport=transport, base_url=server.ARTIQ_HTTP_URL, timeout=timeout)

    monkeypatch.setattr(server, "_client", fake_client)
    return captured


async def test_submit_batch_fans_out_three_variants(monkeypatch):
    """A 3-variant batch fans out to 3 POST /api/scan calls and returns 3 RIDs."""
    captured = _recording_batch_client(monkeypatch, [11, 12, 13])

    results = await server.submit_batch(
        file="scans/rabi.py",
        class_name="RabiFlop",
        priority=-10,
        variants=[
            {"fixed_params": {"rabi.frequency": 100.0}},
            {"fixed_params": {"rabi.frequency": 200.0}},
            {"fixed_params": {"rabi.frequency": 300.0}},
        ],
    )

    # Three requests issued, all against the gated scan endpoint.
    assert len(captured) == 3
    assert [c["url"].path for c in captured] == ["/api/scan"] * 3
    assert all(c["method"] == "POST" for c in captured)

    # Each carried the shared identity + the per-variant fixed_params, and the
    # single batch-wide priority (no per-variant priority).
    assert [c["json"]["fixed_params"] for c in captured] == [
        {"rabi.frequency": 100.0},
        {"rabi.frequency": 200.0},
        {"rabi.frequency": 300.0},
    ]
    assert all(c["json"]["file"] == "scans/rabi.py" for c in captured)
    assert all(c["json"]["priority"] == -10 for c in captured)
    # Default: no scan axes (plain single submission per variant).
    assert all(c["json"]["axes"] == [] for c in captured)

    # Three structured, per-variant success results in input order.
    assert results == [
        {"index": 0, "ok": True, "rid": 11},
        {"index": 1, "ok": True, "rid": 12},
        {"index": 2, "ok": True, "rid": 13},
    ]


async def test_submit_batch_shared_and_per_variant_axes(monkeypatch):
    """Shared axes/num_repeats apply, and a variant may override them."""
    captured = _recording_batch_client(monkeypatch, [1, 2])
    shared_axis = {"fqn": "rabi.frequency", "type": "linear", "range": {"start": 0.0, "stop": 1.0, "num_points": 3}}
    override_axis = {"fqn": "rabi.phase", "type": "linear", "range": {"start": 0.0, "stop": 6.28, "num_points": 5}}

    await server.submit_batch(
        file="scans/rabi.py",
        class_name="RabiFlop",
        axes=[shared_axis],
        num_repeats=4,
        repo_rev="feature-branch",
        variants=[
            {"fixed_params": {"rabi.amplitude": 0.5}},
            {"fixed_params": {"rabi.amplitude": 0.9}, "axes": [override_axis], "num_repeats": 7, "due_date": 42.0},
        ],
    )

    # Variant 0 inherits the shared axis + num_repeats; repo_rev forwarded.
    assert captured[0]["json"]["axes"] == [shared_axis]
    assert captured[0]["json"]["num_repeats"] == 4
    assert captured[0]["json"]["repo_rev"] == "feature-branch"
    assert "due_date" not in captured[0]["json"]

    # Variant 1 overrides axes/num_repeats/due_date.
    assert captured[1]["json"]["axes"] == [override_axis]
    assert captured[1]["json"]["num_repeats"] == 7
    assert captured[1]["json"]["due_date"] == 42.0


async def test_submit_batch_reports_per_variant_errors(monkeypatch):
    """A failing variant is reported individually; the rest still submit."""

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        # Fail the middle variant with a server error; succeed otherwise.
        if body["fixed_params"] == {"rabi.frequency": 200.0}:
            return httpx.Response(400, json={"detail": "bad param"})
        return httpx.Response(200, json=99)

    transport = httpx.MockTransport(handler)
    monkeypatch.setattr(
        server,
        "_client",
        lambda timeout=30.0: httpx.AsyncClient(transport=transport, base_url=server.ARTIQ_HTTP_URL, timeout=timeout),
    )

    results = await server.submit_batch(
        file="scans/rabi.py",
        class_name="RabiFlop",
        variants=[
            {"fixed_params": {"rabi.frequency": 100.0}},
            {"fixed_params": {"rabi.frequency": 200.0}},
            {"fixed_params": {"rabi.frequency": 300.0}},
        ],
    )

    assert results[0] == {"index": 0, "ok": True, "rid": 99}
    assert results[2] == {"index": 2, "ok": True, "rid": 99}
    # Middle variant failed but did not abort the batch.
    assert results[1]["index"] == 1
    assert results[1]["ok"] is False
    assert "error" in results[1]
    assert "400" in results[1]["error"]


async def test_get_devices(monkeypatch):
    captured = _recording_client(monkeypatch, {"core": {"type": "local"}})

    result = await server.get_devices()

    assert result == {"core": {"type": "local"}}
    assert captured["method"] == "GET"
    assert captured["url"].path == "/api/devices"
