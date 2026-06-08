import contextlib
import logging
import os
import sys
from typing import Any
from urllib.parse import quote

import httpx
import uvicorn
from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Mount

logging.basicConfig(level=logging.WARNING, stream=sys.stderr)
log = logging.getLogger(__name__)

ARTIQ_HTTP_URL = os.getenv("ARTIQ_HTTP_URL", "http://localhost:8000").rstrip("/")

# Disable DNS rebinding protection since the MCP server is accessed remotely
# (e.g. Claude Code connecting to the Docker host IP), not just from localhost.
mcp = FastMCP(
    "artiq-http",
    transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False),
)


def _client(timeout: float = 30.0) -> httpx.AsyncClient:
    return httpx.AsyncClient(base_url=ARTIQ_HTTP_URL, timeout=timeout)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@mcp.tool()
async def check_health() -> dict[str, Any]:
    """Check whether the ARTIQ HTTP server is reachable and connected to the ARTIQ master.

    Returns a dict with keys 'status' (str), 'artiq_connected' (bool), and 'details'.
    """
    async with _client() as c:
        r = await c.get("/api/health")
        r.raise_for_status()
        return r.json()


# ---------------------------------------------------------------------------
# Experiment list
# ---------------------------------------------------------------------------


@mcp.tool()
async def list_experiments() -> dict[str, Any]:
    """List all experiments available in the ARTIQ repository.

    Returns a dict with 'experiments' (list), 'scanning' (bool), and 'current_rev' (str|null).
    Each experiment entry has 'name', 'file', 'class_name', 'arginfo', and 'scheduler_defaults'.
    """
    async with _client() as c:
        r = await c.get("/api/explist")
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def search_experiments(query: str) -> dict[str, Any]:
    """Search experiments by name, file path, or class name (case-insensitive substring match).

    Args:
        query: Substring to search for.

    Returns a filtered experiment list in the same format as list_experiments().
    """
    async with _client() as c:
        r = await c.get("/api/explist/search", params={"q": query})
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def get_experiment_defaults(file: str, class_name: str) -> dict[str, Any]:
    """Get the default argument values for a specific experiment.

    Args:
        file: Relative path to the experiment file, e.g. "idle.py" or "scans/rabi.py".
        class_name: Python class name of the experiment, e.g. "Idle" or "RabiFlop".

    Returns a dict with 'file', 'class_name', and 'arguments' (dict of name -> default value).
    """
    encoded_file = quote(file, safe="/")
    encoded_class = quote(class_name, safe="")
    async with _client() as c:
        r = await c.get(f"/api/explist/{encoded_file}/{encoded_class}/defaults")
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def get_experiment_arginfo(file: str, class_name: str) -> dict[str, Any]:
    """Get the full parameter schema (arginfo) for a specific experiment.

    This includes the complete ndscan_params schemata, which is omitted from the
    lightweight list_experiments / search_experiments responses.

    Args:
        file: Relative path to the experiment file, e.g. "idle.py".
        class_name: Python class name of the experiment, e.g. "Idle".

    Returns a dict with 'file', 'class_name', and 'arginfo'.
    """
    encoded_file = quote(file, safe="/")
    encoded_class = quote(class_name, safe="")
    async with _client() as c:
        r = await c.get(f"/api/explist/{encoded_file}/{encoded_class}/arginfo")
        r.raise_for_status()
        return r.json()


# ---------------------------------------------------------------------------
# Schedule
# ---------------------------------------------------------------------------


@mcp.tool()
async def get_schedule() -> dict[str, Any]:
    """Get the current ARTIQ experiment schedule (all queued and running experiments).

    Returns a dict mapping RID (str) -> schedule item.
    Each item has 'pipeline', 'priority', 'status', 'expid', 'due_date', 'flush'.
    """
    async with _client() as c:
        r = await c.get("/api/schedule")
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def submit_experiment(
    file: str,
    class_name: str,
    arguments: dict[str, Any] | None = None,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
) -> int:
    """Submit an experiment and return its Run ID (RID) immediately without waiting.

    Use submit_and_wait() instead if you need to know when the experiment finishes.

    Args:
        file: Relative path to the experiment file, e.g. "idle.py".
        class_name: Python class name of the experiment, e.g. "Idle".
        arguments: Experiment arguments as a dict. Omit or pass None to use server defaults.
        pipeline: Scheduling pipeline name (default: "main").
        priority: Scheduling priority — higher runs sooner (default: 0).
        flush: If True, flush the pipeline before submitting (default: False).

    Returns:
        The integer Run ID (RID) assigned to this submission.
    """
    expid = {"file": file, "class_name": class_name, "arguments": arguments}
    params = {"pipeline": pipeline, "priority": priority, "flush": flush}
    async with _client() as c:
        r = await c.post("/api/schedule", json=expid, params=params)
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def submit_and_wait(
    file: str,
    class_name: str,
    arguments: dict[str, Any] | None = None,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    timeout_seconds: float = 60.0,
) -> dict[str, Any]:
    """Submit an experiment and wait for it to complete before returning.

    Args:
        file: Relative path to the experiment file, e.g. "idle.py".
        class_name: Python class name of the experiment, e.g. "Idle".
        arguments: Experiment arguments as a dict. Omit or pass None to use server defaults.
        pipeline: Scheduling pipeline name (default: "main").
        priority: Scheduling priority (default: 0).
        flush: If True, flush the pipeline before submitting (default: False).
        timeout_seconds: Max seconds to wait before returning regardless (default: 60, max: 300).

    Returns:
        Dict with 'rid' (int), 'status' (str: "completed"/"failed"/"timeout"),
        'timed_out' (bool), and 'error' (str|None — set when status is "failed").
    """
    expid = {"file": file, "class_name": class_name, "arguments": arguments}
    params = {
        "pipeline": pipeline,
        "priority": priority,
        "flush": flush,
        "timeout": min(timeout_seconds, 300.0),
    }
    # Give the httpx client a generous timeout beyond the server-side wait.
    client_timeout = min(timeout_seconds, 300.0) + 15.0
    async with _client(timeout=client_timeout) as c:
        r = await c.post("/api/schedule/submit-and-wait", json=expid, params=params)
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def submit_1d_scan(
    file: str,
    class_name: str,
    axis_fqn: str,
    scan_type: str,
    scan_range: dict[str, Any],
    fixed_params: dict[str, Any] | None = None,
    num_repeats: int = 1,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
) -> int:
    """Submit a 1-D ndscan scan without handcrafting ndscan_params.

    The server builds canonical ndscan_params from the provided axis and
    fixed-parameter overrides, then submits the experiment.

    Args:
        file: Relative path to the experiment file, e.g. "scans/rabi.py".
        class_name: Python class name of the experiment, e.g. "RabiFlop".
        axis_fqn: Fully-qualified parameter name of the scan axis,
            e.g. "my_exp.frequency".  Must exist in the experiment's ndscan schemata.
        scan_type: ndscan generator name — one of "linear", "centre_span",
            "list" (case-sensitive).
        scan_range: Range specification dict.
            For "linear":
                {"start": <float>, "stop": <float>, "num_points": <int>}
            For "centre_span":
                {"centre": <float>, "half_span": <float>, "num_points": <int>}
            For "list":
                {"values": [<float>, ...]}
            An optional "randomise_order": <bool> may be added to any range.
            Values must be in SI units as declared by the experiment parameter schema.
        fixed_params: Optional dict of {fqn: value} for parameters to hold
            fixed at a specific value during the scan.  Must not overlap with axis_fqn.
        num_repeats: Number of times to repeat the full scan (default 1).
        pipeline: Scheduling pipeline name (default "main").
        priority: Scheduling priority — higher runs sooner (default 0).
        flush: Flush the pipeline before submitting (default False).

    Returns:
        The integer Run ID (RID) assigned to this submission.
    """
    payload = {
        "file": file,
        "class_name": class_name,
        "axes": [{"fqn": axis_fqn, "type": scan_type, "range": scan_range}],
        "fixed_params": fixed_params,
        "num_repeats": num_repeats,
        "pipeline": pipeline,
        "priority": priority,
        "flush": flush,
    }
    async with _client() as c:
        r = await c.post("/api/scan", json=payload)
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def submit_multi_axis_scan(
    file: str,
    class_name: str,
    axes: list[dict[str, Any]],
    fixed_params: dict[str, Any] | None = None,
    num_repeats: int = 1,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
) -> int:
    """Submit a multi-axis ndscan scan without handcrafting ndscan_params.

    Each axis is scanned independently (not a grid); ndscan interleaves them
    point-by-point.  For a single-axis scan prefer submit_1d_scan().

    Args:
        file: Relative path to the experiment file, e.g. "scans/rabi.py".
        class_name: Python class name of the experiment, e.g. "RabiFlop".
        axes: List of axis dicts.  Each dict must have:
            - "fqn" (str): Fully-qualified parameter name.
            - "type" (str): ndscan generator name — one of "linear",
              "centre_span", "list" (case-sensitive).
            - "range" (dict): For "linear": {"start", "stop", "num_points"}.
              For "centre_span": {"centre", "half_span", "num_points"}.
              For "list": {"values": [<float>, ...]}. Optional "randomise_order".
            Values must be in SI units as declared by the experiment schema.
        fixed_params: Optional dict of {fqn: value} for parameters to hold
            fixed during the scan.  Must not overlap with any axis fqn.
        num_repeats: Number of times to repeat the full scan (default 1).
        pipeline: Scheduling pipeline name (default "main").
        priority: Scheduling priority — higher runs sooner (default 0).
        flush: Flush the pipeline before submitting (default False).

    Returns:
        The integer Run ID (RID) assigned to this submission.
    """
    payload = {
        "file": file,
        "class_name": class_name,
        "axes": axes,
        "fixed_params": fixed_params,
        "num_repeats": num_repeats,
        "pipeline": pipeline,
        "priority": priority,
        "flush": flush,
    }
    async with _client() as c:
        r = await c.post("/api/scan", json=payload)
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def cancel_experiment(rid: int, force: bool = False) -> str:
    """Cancel a queued or running experiment.

    Args:
        rid: Run ID of the experiment to cancel.
        force: If True, forcibly delete the run entry. If False (default), request
               graceful termination.

    Returns:
        Confirmation message string.
    """
    async with _client() as c:
        r = await c.post("/api/cancel", params={"rid": rid, "force": force})
        r.raise_for_status()
        return f"Cancel requested for RID {rid} (force={force})"


# ---------------------------------------------------------------------------
# Datasets
# ---------------------------------------------------------------------------


@mcp.tool()
async def list_dataset_names() -> list[str]:
    """List the names of all datasets currently held on the ARTIQ master."""
    async with _client() as c:
        r = await c.get("/api/datasets/names")
        r.raise_for_status()
        return r.json()["names"]


@mcp.tool()
async def get_dataset_values(names: list[str]) -> dict[str, Any]:
    """Get the current values of one or more ARTIQ datasets.

    Args:
        names: List of dataset key names to retrieve, e.g. ["results", "counts"].

    Returns:
        Dict mapping each requested dataset name to its current value.
        Names that do not exist are silently omitted.
    """
    async with _client() as c:
        r = await c.get("/api/datasets/values", params={"names": ",".join(names)})
        r.raise_for_status()
        raw = r.json()

    # ARTIQ datasets are returned as [persist, value, metadata] tuples.
    # Unwrap them so clients get the raw value.
    return {
        name: (
            value[1]
            if isinstance(value, list) and len(value) == 3 and isinstance(value[0], bool) and isinstance(value[2], dict)
            else value
        )
        for name, value in raw.items()
    }


# ---------------------------------------------------------------------------
# Logs
# ---------------------------------------------------------------------------


@mcp.tool()
async def get_logs(
    source_regex: str | None = None,
    message_regex: str | None = None,
    min_level: int | None = None,
    max_level: int | None = None,
    since: float | None = None,
    until: float | None = None,
    limit: int | None = None,
) -> dict[str, Any]:
    """Get buffered ARTIQ system log entries with optional filtering.

    Each entry has ``timestamp`` (float), ``source`` (str), ``level`` (int),
    and ``message`` (str).

    Args:
        source_regex: Regex applied to the ``source`` field.
        message_regex: Regex applied to the ``message`` field.
        min_level: Minimum ``level`` (inclusive).
        max_level: Maximum ``level`` (inclusive).
        since: Minimum ``timestamp`` (inclusive).
        until: Maximum ``timestamp`` (inclusive).
        limit: Maximum number of entries to return.

    Returns a dict with key ``logs`` containing the filtered entries.
    """
    params: dict[str, Any] = {}
    if source_regex is not None:
        params["source_regex"] = source_regex
    if message_regex is not None:
        params["message_regex"] = message_regex
    if min_level is not None:
        params["min_level"] = min_level
    if max_level is not None:
        params["max_level"] = max_level
    if since is not None:
        params["since"] = since
    if until is not None:
        params["until"] = until
    if limit is not None:
        params["limit"] = limit

    async with _client() as c:
        r = await c.get("/api/logs", params=params)
        r.raise_for_status()
        return r.json()


# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------


@mcp.prompt()
def run_experiment_workflow(experiment_name: str = "") -> list[dict]:
    """Guided workflow for safely submitting an ARTIQ experiment.

    Use this prompt when the user wants to run an experiment. It ensures
    the model checks system health, locates the correct experiment,
    validates arguments, and monitors execution.
    """
    messages = [
        {
            "role": "user",
            "content": (
                "You are an ARTIQ experiment operator. Follow this workflow rigorously when running experiments.\n\n"
                "I want to run an ARTIQ experiment" + (f": {experiment_name}" if experiment_name else "") + ".\n\n"
                "Follow this exact workflow:\n\n"
                "1. **Check health** — Call `check_health()` first. If "
                "`artiq_connected` is false, stop and warn the user.\n\n"
                "2. **Find the experiment** — Call `list_experiments()` or "
                "`search_experiments()` to locate the experiment. Confirm the "
                "exact `file` and `class_name` with the user if ambiguous.\n\n"
                "3. **Get defaults** — Call `get_experiment_defaults(file, class_name)` "
                "to see default arguments. Show them to the user.\n\n"
                "4. **Confirm arguments** — Ask the user if they want to override "
                "any defaults. Do not guess values for physical parameters "
                "(laser power, pulse duration, magnetic field, etc.).\n\n"
                "5. **Submit** — Use `submit_and_wait()` for short experiments "
                "(under 60s) or `submit_experiment()` for long runs. Report the RID.\n\n"
                "6. **Monitor** — If using `submit_experiment()`, poll "
                "`get_schedule()` to track status. Report completion or errors.\n\n"
                "Safety rules:\n"
                "- Never submit experiments when ARTIQ is disconnected.\n"
                "- Never override defaults without explicit user confirmation.\n"
                "- If an experiment is stuck, ask before calling `cancel_experiment()`."
            ),
        },
    ]
    return messages


@mcp.prompt()
def analyze_datasets(experiment_rid: int | None = None) -> list[dict]:
    """Guided workflow for inspecting ARTIQ datasets and experimental results.

    Use this prompt when the user wants to see results, check measurement
    data, or analyze experiment outputs stored in ARTIQ datasets.
    """
    messages = [
        {
            "role": "user",
            "content": (
                "You are an ARTIQ data analyst. Help the user inspect and interpret experimental datasets.\n\n"
                "Help me analyze ARTIQ datasets"
                + (f" from experiment RID {experiment_rid}" if experiment_rid else "")
                + ".\n\n"
                "Follow this workflow:\n\n"
                "1. **List datasets** — Call `list_dataset_names()` to see all "
                "available datasets. If the user mentioned specific names, focus "
                "on those.\n\n"
                "2. **Fetch values** — Call `get_dataset_values(names)` with the "
                "relevant dataset names. Request only what you need; datasets can "
                "be large.\n\n"
                "3. **Interpret** — Explain what the data represents in physical "
                "terms (counts, voltages, frequencies, temperatures, etc.).\n\n"
                "4. **Summarize** — Provide concise statistics: shape, ranges, "
                "means, obvious anomalies. Mention if values are NaN or missing.\n\n"
                "Common dataset patterns in ARTIQ:\n"
                "- `ndscan` experiments store scan axes and points under "
                "names like `ndscan.points`, `ndscan.axes`.\n"
                "- Single-shot results are often scalars or 1D arrays.\n"
                "- Time-series data may be 2D (shots x samples).\n"
                "- Calibration experiments often store fit parameters.\n\n"
                "If the user wants plotting, describe the data structure so "
                "they can visualize it externally."
            ),
        },
    ]
    return messages


@mcp.prompt()
def manage_schedule() -> list[dict]:
    """Guided workflow for monitoring and managing the ARTIQ experiment schedule.

    Use this prompt when the user asks about queued experiments, running
    experiments, or wants to cancel/modify the schedule.
    """
    messages = [
        {
            "role": "user",
            "content": (
                "You are an ARTIQ scheduler operator. Help the user understand and manage the experiment queue.\n\n"
                "Help me manage the ARTIQ experiment schedule.\n\n"
                "Follow this workflow:\n\n"
                "1. **Get current state** — Call `get_schedule()` to see all "
                "queued and running experiments. Report:\n"
                "   - Number of running vs queued experiments\n"
                "   - Each experiment's RID, pipeline, priority, and status\n"
                "   - The `file` and `class_name` from the `expid` field\n\n"
                "2. **Interpret priorities** — Higher priority values run sooner. "
                "Priority 0 is default. Explain the scheduling implications if asked.\n\n"
                "3. **Pipelines** — ARTIQ uses named pipelines (default: 'main'). "
                "Experiments in different pipelines run independently.\n\n"
                "4. **Cancellation** — If the user wants to cancel:\n"
                "   - First show the experiment details and ask for confirmation.\n"
                "   - Use `cancel_experiment(rid, force=False)` for graceful termination.\n"
                "   - Use `force=True` only if the user explicitly requests it or "
                "the experiment is unresponsive.\n"
                "   - Confirm the cancellation result.\n\n"
                "5. **Status meanings**:\n"
                "   - `run_prep`, `prepare_run`: Experiment is initializing\n"
                "   - `running`: Actively executing\n"
                "   - `paused`: Experiment is paused (rare)\n"
                "   - Missing from schedule: Experiment completed or was deleted\n\n"
                "Never cancel experiments without user confirmation unless "
                "explicitly instructed to auto-manage the queue."
            ),
        },
    ]
    return messages


# ---------------------------------------------------------------------------
# Resources
# ---------------------------------------------------------------------------


@mcp.resource("artiq://health")
async def artiq_health() -> str:
    """Current ARTIQ system health and connection status.

    Use this resource to quickly check if the ARTIQ master is connected
    and all subsystems are healthy before performing operations.
    """
    async with _client() as c:
        r = await c.get("/api/health")
        r.raise_for_status()
        data = r.json()

    status = data.get("status", "unknown")
    artiq_connected = data.get("artiq_connected", False)
    details = data.get("details", {})

    lines = [
        f"ARTIQ Health Status: {status.upper()}",
        f"ARTIQ Master Connected: {'yes' if artiq_connected else 'NO'}",
        "",
        "Subscriber Details:",
    ]
    for name, connected in details.items():
        icon = "OK" if connected else "DOWN"
        lines.append(f"  [{icon}] {name}")

    if status != "healthy":
        lines.append("")
        lines.append("WARNING: System is not fully healthy. Some operations may fail.")

    return "\n".join(lines)


@mcp.resource("artiq://experiments")
async def artiq_experiments() -> str:
    """Catalog of all experiments available in the ARTIQ repository.

    Use this resource to see what experiments exist, their file paths,
    and class names. Useful when the user asks 'what experiments do we have?'
    or when you need to disambiguate experiment names.
    """
    async with _client() as c:
        r = await c.get("/api/explist")
        r.raise_for_status()
        data = r.json()

    experiments = data.get("experiments", [])
    scanning = data.get("scanning", False)
    current_rev = data.get("current_rev", "unknown")

    lines = [
        f"Repository Revision: {current_rev or 'unknown'}",
        f"Scanning: {'in progress' if scanning else 'idle'}",
        f"Total Experiments: {len(experiments)}",
        "",
        "Experiments:",
    ]

    by_dir: dict[str, list[dict]] = {}
    for exp in experiments:
        file_path = exp.get("file", "unknown")
        directory = file_path.rsplit("/", 1)[0] if "/" in file_path else "(root)"
        by_dir.setdefault(directory, []).append(exp)

    for directory in sorted(by_dir.keys()):
        lines.append(f"\n  [{directory}]")
        for exp in sorted(by_dir[directory], key=lambda e: e.get("name", "")):
            name = exp.get("name", "unknown")
            class_name = exp.get("class_name", "unknown")
            file_path = exp.get("file", "unknown")
            lines.append(f"    - {name} ({class_name})  [{file_path}]")

    lines.append("")
    lines.append("To run an experiment, you need: file=<path> and class_name=<class>.")

    return "\n".join(lines)


@mcp.resource("artiq://schedule")
async def artiq_schedule() -> str:
    """Current ARTIQ experiment schedule (running and queued experiments).

    Use this resource to get a quick overview of active experiments
    without calling a tool. Helpful for answering 'what is running?'
    or monitoring queue state.
    """
    async with _client() as c:
        r = await c.get("/api/schedule")
        r.raise_for_status()
        schedule = r.json()

    if not schedule:
        return "No experiments are currently queued or running."

    running = []
    queued = []

    for rid_str, item in schedule.items():
        rid = int(rid_str) if rid_str.isdigit() else rid_str
        status = item.get("status", "unknown")
        pipeline = item.get("pipeline", "main")
        priority = item.get("priority", 0)
        expid = item.get("expid", {})
        file_path = expid.get("file", "unknown")
        class_name = expid.get("class_name", "unknown")

        entry = {
            "rid": rid,
            "status": status,
            "pipeline": pipeline,
            "priority": priority,
            "file": file_path,
            "class_name": class_name,
        }

        if status in ("running", "run_prep", "prepare_run"):
            running.append(entry)
        else:
            queued.append(entry)

    lines = [f"Total items in schedule: {len(schedule)}", ""]

    if running:
        lines.append(f"Running ({len(running)}):")
        for entry in running:
            lines.append(
                f"  RID {entry['rid']}: {entry['class_name']} "
                f"({entry['file']})  [pipeline={entry['pipeline']}, "
                f"priority={entry['priority']}]"
            )
        lines.append("")

    if queued:
        queued.sort(key=lambda e: e["priority"], reverse=True)
        lines.append(f"Queued ({len(queued)}):")
        for entry in queued:
            lines.append(
                f"  RID {entry['rid']}: {entry['class_name']} "
                f"({entry['file']})  [pipeline={entry['pipeline']}, "
                f"priority={entry['priority']}]"
            )
        lines.append("")

    lines.append("Experiments disappear from the schedule when they complete.")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# HTTP server entry point
# ---------------------------------------------------------------------------


@contextlib.asynccontextmanager
async def lifespan(app: Starlette):
    async with mcp.session_manager.run():
        yield


starlette_app = Starlette(
    routes=[
        Mount("/", app=mcp.streamable_http_app()),
    ],
    lifespan=lifespan,
)

starlette_app = CORSMiddleware(
    starlette_app,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "DELETE"],
    expose_headers=["Mcp-Session-Id"],
)

if __name__ == "__main__":
    port = int(os.getenv("MCP_PORT", "8001"))
    uvicorn.run(starlette_app, host="0.0.0.0", port=port)
