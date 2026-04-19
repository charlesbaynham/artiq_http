import contextlib
import logging
import os
import sys
from typing import Any
from urllib.parse import quote

import httpx
import uvicorn
from mcp.server.fastmcp import FastMCP
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Mount

# All logging must go to stderr — stdout is reserved for HTTP responses.
logging.basicConfig(level=logging.WARNING, stream=sys.stderr)
log = logging.getLogger(__name__)

ARTIQ_HTTP_URL = os.getenv("ARTIQ_HTTP_URL", "http://localhost:8000").rstrip("/")

mcp = FastMCP("artiq-http")


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
        Dict with 'rid' (int), 'status' (str, e.g. "completed"/"timeout"), 'timed_out' (bool).
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
        return r.json()


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
