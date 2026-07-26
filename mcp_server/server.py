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
# Response trimming helpers
#
# Several ARTIQ responses are dominated by bulk that an agent rarely needs up
# front: a running ndscan scan carries its entire ``ndscan_params`` schemata
# (every parameter's description, type and spec) inside the schedule item's
# expid, and the experiment list repeats arginfo/docstrings for every class.
# Returning that by default makes the schedule and explist tools enormous, so
# the listing tools below trim to a compact view and expose a ``verbose`` flag
# (or a per-experiment tool) for the full detail.
# ---------------------------------------------------------------------------


def _summarize_expid(expid: dict[str, Any]) -> dict[str, Any]:
    """Return a compact view of an expid with the bulky arguments dropped.

    Keeps the experiment identity (``file``, ``class_name``, ``repo_rev``) and
    replaces ``arguments`` with a lightweight description: an ``is_scan`` flag
    when ndscan_params is present, plus the names of any other arguments. The
    full ndscan_params schemata are omitted — use the schedule tools'
    ``verbose=True`` to get them back.
    """
    if not isinstance(expid, dict):
        return expid
    summary: dict[str, Any] = {
        "file": expid.get("file"),
        "class_name": expid.get("class_name"),
    }
    if expid.get("repo_rev") is not None:
        summary["repo_rev"] = expid["repo_rev"]
    arguments = expid.get("arguments")
    if isinstance(arguments, dict):
        if "ndscan_params" in arguments:
            summary["is_scan"] = True
        other_keys = sorted(k for k in arguments if k != "ndscan_params")
        if other_keys:
            summary["argument_keys"] = other_keys
    return summary


def _summarize_schedule_item(item: dict[str, Any]) -> dict[str, Any]:
    """Return a compact view of a schedule item (bulky expid arguments dropped)."""
    if not isinstance(item, dict):
        return item
    summary: dict[str, Any] = {
        "pipeline": item.get("pipeline"),
        "priority": item.get("priority"),
        "status": item.get("status"),
        "due_date": item.get("due_date"),
        "flush": item.get("flush"),
    }
    if item.get("repo_msg") is not None:
        summary["repo_msg"] = item["repo_msg"]
    summary["expid"] = _summarize_expid(item.get("expid") or {})
    return summary


def _summarize_experiment(exp: dict[str, Any]) -> dict[str, Any]:
    """Return a compact experiment-list entry: identity plus a one-line summary.

    Keeps ``name``, ``file``, ``class_name`` and the first non-empty line of the
    docstring as ``summary``. The per-experiment parameter schema (arginfo),
    scheduler defaults and full docstring are dropped — fetch them for a single
    experiment with ``get_experiment_arginfo`` / ``get_experiment_defaults``.
    """
    if not isinstance(exp, dict):
        return exp
    summary: dict[str, Any] = {
        "name": exp.get("name"),
        "file": exp.get("file"),
        "class_name": exp.get("class_name"),
    }
    docstring = exp.get("docstring")
    if docstring:
        first_line = next((line.strip() for line in docstring.splitlines() if line.strip()), "")
        if first_line:
            summary["summary"] = first_line
    return summary


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


_VERBOSE_EXPLIST_FIELDS = "name,file,class_name,docstring,arginfo,scheduler_defaults"


@mcp.tool()
async def list_experiments(verbose: bool = False) -> dict[str, Any]:
    """List the experiments available in the ARTIQ repository (compact by default).

    By default each entry is trimmed to 'name', 'file', 'class_name' and a
    one-line 'summary' (the first line of the docstring), so the list stays small
    even for a large repository. The per-experiment parameter schema (arginfo) is
    NOT included — fetch it for a single experiment with get_experiment_arginfo()
    or get_experiment_defaults().

    Args:
        verbose: If True, return the full entries (docstrings, arginfo with
            ndscan params filtered to the always-shown set, and scheduler_defaults).
            This can be large; prefer the per-experiment tools for full detail.

    Returns a dict with 'experiments' (list), 'scanning' (bool), and 'current_rev' (str|null).
    """
    params = {"fields": _VERBOSE_EXPLIST_FIELDS} if verbose else None
    async with _client() as c:
        r = await c.get("/api/explist", params=params)
        r.raise_for_status()
        data = r.json()
    if not verbose:
        data["experiments"] = [_summarize_experiment(exp) for exp in data.get("experiments", [])]
    return data


@mcp.tool()
async def search_experiments(query: str, verbose: bool = False) -> dict[str, Any]:
    """Search experiments by name, file path, or class name (case-insensitive substring match).

    Args:
        query: Substring to search for.
        verbose: If True, return full entries (docstrings, arginfo, scheduler_defaults)
            instead of the compact form. See list_experiments() for the trade-off.

    Returns a filtered experiment list in the same format as list_experiments().
    """
    params: dict[str, Any] = {"q": query}
    if verbose:
        params["fields"] = _VERBOSE_EXPLIST_FIELDS
    async with _client() as c:
        r = await c.get("/api/explist/search", params=params)
        r.raise_for_status()
        data = r.json()
    if not verbose:
        data["experiments"] = [_summarize_experiment(exp) for exp in data.get("experiments", [])]
    return data


@mcp.tool()
async def get_experiment_defaults(
    file: str,
    class_name: str,
    revision: str | None = None,
) -> dict[str, Any]:
    """Get the default argument values for a specific experiment.

    By default the defaults come from the master's current revision. Pass
    *revision* to re-examine the experiment at a specific git revision/branch/tag
    and get its defaults instead — this works for an experiment that exists only
    on another branch (not the current one) and does not re-scan the whole
    repository. It returns the concise name -> default map; for the full raw
    arginfo at a revision use ``recompute_experiment_arguments``.

    Args:
        file: Relative path to the experiment file, e.g. "idle.py" or "scans/rabi.py".
        class_name: Python class name of the experiment, e.g. "Idle" or "RabiFlop".
        revision: Git revision/branch/tag to examine. Omit to use the master's
            current revision.

    Returns a dict with 'file', 'class_name', and 'arguments' (dict of name -> default value).
    """
    encoded_file = quote(file, safe="/")
    encoded_class = quote(class_name, safe="")
    params = {"revision": revision} if revision is not None else None
    async with _client() as c:
        r = await c.get(f"/api/explist/{encoded_file}/{encoded_class}/defaults", params=params)
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


@mcp.tool()
async def recompute_experiment_arguments(file: str, class_name: str, revision: str | None = None) -> dict[str, Any]:
    """Re-examine an experiment at a given git revision/branch and return its fresh arginfo.

    This is the equivalent of the ARTIQ dashboard's "Recompute all arguments": it
    re-evaluates which arguments exist and their defaults for the experiment as
    defined at *revision*, rather than the master's statically-scanned current
    revision. Use this to inspect an experiment on a different branch; pass the same
    revision as repo_rev when submitting so it actually runs from that revision.

    Args:
        file: Relative path to the experiment file, e.g. "scans/rabi.py".
        class_name: Python class name of the experiment, e.g. "RabiFlop".
        revision: Git revision/branch/tag to examine. Omit to use the master's
            current revision.

    Returns a dict with 'file', 'class_name', and 'arginfo'.
    """
    encoded_file = quote(file, safe="/")
    encoded_class = quote(class_name, safe="")
    params = {"revision": revision} if revision is not None else None
    async with _client() as c:
        r = await c.post(f"/api/explist/{encoded_file}/{encoded_class}/recompute", params=params)
        r.raise_for_status()
        return r.json()


# ---------------------------------------------------------------------------
# Schedule
# ---------------------------------------------------------------------------


@mcp.tool()
async def get_schedule(verbose: bool = False) -> dict[str, Any]:
    """Get the current ARTIQ experiment schedule (all queued and running experiments).

    Returns a dict mapping RID (str) -> schedule item. By default each item is
    compact: 'pipeline', 'priority', 'status', 'due_date', 'flush' and an 'expid'
    trimmed to 'file', 'class_name', 'repo_rev' and — for ndscan scans — an
    'is_scan' flag plus any non-ndscan 'argument_keys'. The bulky experiment
    arguments (in particular a running scan's full ndscan_params schemata) are
    omitted so the schedule stays small.

    Args:
        verbose: If True, return the full, untrimmed items including every expid
            argument. Prefer get_schedule_item(rid, verbose=True) to inspect the
            full arguments of a single run.
    """
    async with _client() as c:
        r = await c.get("/api/schedule")
        r.raise_for_status()
        schedule = r.json()
    if verbose:
        return schedule
    return {rid: _summarize_schedule_item(item) for rid, item in schedule.items()}


@mcp.tool()
async def get_schedule_item(rid: int, verbose: bool = False) -> dict[str, Any]:
    """Get a single schedule item by its Run ID (RID).

    Args:
        rid: Run ID of the experiment to look up.
        verbose: If True, return the full item including the complete expid
            arguments (a running scan's ndscan_params can be large). If False
            (default), return the compact form described in get_schedule().

    Returns the schedule item dict. Raises an error if the RID is not currently
    in the schedule (e.g. it already completed or was never submitted).
    """
    async with _client() as c:
        r = await c.get(f"/api/schedule/{rid}")
        r.raise_for_status()
        item = r.json()
    return item if verbose else _summarize_schedule_item(item)


@mcp.tool()
async def submit_experiment(
    file: str,
    class_name: str,
    arguments: dict[str, Any] | None = None,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    repo_rev: str | None = None,
    due_date: float | None = None,
    log_level: int | None = None,
    wait_for_completion: bool = False,
    timeout_seconds: float = 600.0,
) -> int | dict[str, Any]:
    """Submit an experiment, optionally waiting for it to complete.

    By default this returns the Run ID (RID) immediately. Set
    ``wait_for_completion=True`` to block until the experiment finishes.

    Args:
        file: Relative path to the experiment file, e.g. "idle.py".
        class_name: Python class name of the experiment, e.g. "Idle".
        arguments: Experiment arguments as a dict. Omit or pass None to use server defaults.
        pipeline: Scheduling pipeline name (default: "main").
        priority: Scheduling priority — higher runs sooner (default: 0).
        flush: If True, flush the pipeline before submitting (default: False).
        repo_rev: Git revision (commit hash, branch, or tag) of the experiment
            repository to check out before running. Omit or pass None to use the
            master's current revision.
        due_date: Earliest time the experiment may run, as a Unix timestamp.
            Omit or pass None to run as soon as scheduled.
        log_level: Python logging level for the experiment's worker (e.g. 10=DEBUG,
            20=INFO, 30=WARNING). Omit or pass None to use the server default.
        wait_for_completion: If True, wait for the experiment to finish before
            returning (default: False).
        timeout_seconds: Max seconds to wait when ``wait_for_completion`` is True
            (default: 600, max: 21600).

    Returns:
        The integer Run ID (RID) when ``wait_for_completion`` is False, or a dict
        with 'rid' (int), 'status' (str: "completed"/"failed"/"timeout"),
        'timed_out' (bool), and 'error' (str|None — set when status is "failed")
        when it is True.
    """
    expid: dict[str, Any] = {"file": file, "class_name": class_name, "arguments": arguments}
    if repo_rev is not None:
        expid["repo_rev"] = repo_rev
    if log_level is not None:
        expid["log_level"] = log_level
    params: dict[str, Any] = {"pipeline": pipeline, "priority": priority, "flush": flush}
    if due_date is not None:
        params["due_date"] = due_date
    if wait_for_completion:
        timeout = min(timeout_seconds, 21600.0)
        params["wait_for_completion"] = True
        params["timeout"] = timeout
        # Give the httpx client a generous timeout beyond the server-side wait.
        async with _client(timeout=timeout + 15.0) as c:
            r = await c.post("/api/schedule", json=expid, params=params)
            r.raise_for_status()
            return r.json()
    async with _client() as c:
        r = await c.post("/api/schedule", json=expid, params=params)
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
    repo_rev: str | None = None,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    due_date: float | None = None,
    skip_on_persistent_transitory_error: bool = False,
    randomise_order_globally: bool = False,
    wait_for_completion: bool = False,
    timeout_seconds: float = 600.0,
) -> int | dict[str, Any]:
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
        repo_rev: Git revision (commit hash, branch, or tag) of the experiment
            repository to check out before building and running the scan. Omit or
            pass None to use the master's current revision. Use this to scan an
            experiment that exists only on another branch (by ref) — the scan
            parameters are built from that revision's arguments.
        pipeline: Scheduling pipeline name (default "main").
        priority: Scheduling priority — higher runs sooner (default 0).
        flush: Flush the pipeline before submitting (default False).
        due_date: Earliest time the scan may run, as a Unix timestamp. Omit or
            pass None to run as soon as scheduled.
        skip_on_persistent_transitory_error: If True, ndscan skips (rather than
            aborts the whole scan on) a point that keeps hitting a transitory
            error after exhausting its retries (default False).
        randomise_order_globally: If True, randomise the order in which the
            overall grid of scan-axis combinations is visited, in addition to
            any per-axis "randomise_order" set in scan_range (default False).
        wait_for_completion: If True, wait for the scan to finish before
            returning (default False).
        timeout_seconds: Max seconds to wait when ``wait_for_completion`` is True
            (default 600, max 21600).

    Returns:
        The integer Run ID (RID) when ``wait_for_completion`` is False, or a dict
        with 'rid', 'status' ("completed"/"failed"/"timeout"), 'timed_out', and
        'error' when it is True.
    """
    payload: dict[str, Any] = {
        "file": file,
        "class_name": class_name,
        "axes": [{"fqn": axis_fqn, "type": scan_type, "range": scan_range}],
        "fixed_params": fixed_params,
        "num_repeats": num_repeats,
        "pipeline": pipeline,
        "priority": priority,
        "flush": flush,
        "skip_on_persistent_transitory_error": skip_on_persistent_transitory_error,
        "randomise_order_globally": randomise_order_globally,
    }
    if repo_rev is not None:
        payload["repo_rev"] = repo_rev
    if due_date is not None:
        payload["due_date"] = due_date
    return await _post_scan(payload, wait_for_completion, timeout_seconds)


async def _post_scan(
    payload: dict[str, Any],
    wait_for_completion: bool,
    timeout_seconds: float,
) -> int | dict[str, Any]:
    """POST a scan request to /api/scan, optionally waiting for completion."""
    if wait_for_completion:
        timeout = min(timeout_seconds, 21600.0)
        params = {"wait_for_completion": True, "timeout": timeout}
        # Give the httpx client a generous timeout beyond the server-side wait.
        async with _client(timeout=timeout + 15.0) as c:
            r = await c.post("/api/scan", json=payload, params=params)
            r.raise_for_status()
            return r.json()
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
    repo_rev: str | None = None,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    due_date: float | None = None,
    skip_on_persistent_transitory_error: bool = False,
    randomise_order_globally: bool = False,
    wait_for_completion: bool = False,
    timeout_seconds: float = 600.0,
) -> int | dict[str, Any]:
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
        repo_rev: Git revision (commit hash, branch, or tag) of the experiment
            repository to check out before building and running the scan. Omit or
            pass None to use the master's current revision. Use this to scan an
            experiment that exists only on another branch (by ref) — the scan
            parameters are built from that revision's arguments.
        pipeline: Scheduling pipeline name (default "main").
        priority: Scheduling priority — higher runs sooner (default 0).
        flush: Flush the pipeline before submitting (default False).
        due_date: Earliest time the scan may run, as a Unix timestamp. Omit or
            pass None to run as soon as scheduled.
        skip_on_persistent_transitory_error: If True, ndscan skips (rather than
            aborts the whole scan on) a point that keeps hitting a transitory
            error after exhausting its retries (default False).
        randomise_order_globally: If True, randomise the order in which the
            overall grid of scan-axis combinations is visited, in addition to
            any per-axis "randomise_order" set within an individual axis's
            range (default False).
        wait_for_completion: If True, wait for the scan to finish before
            returning (default False).
        timeout_seconds: Max seconds to wait when ``wait_for_completion`` is True
            (default 600, max 21600).

    Returns:
        The integer Run ID (RID) when ``wait_for_completion`` is False, or a dict
        with 'rid', 'status' ("completed"/"failed"/"timeout"), 'timed_out', and
        'error' when it is True.
    """
    payload: dict[str, Any] = {
        "file": file,
        "class_name": class_name,
        "axes": axes,
        "fixed_params": fixed_params,
        "num_repeats": num_repeats,
        "pipeline": pipeline,
        "priority": priority,
        "flush": flush,
        "skip_on_persistent_transitory_error": skip_on_persistent_transitory_error,
        "randomise_order_globally": randomise_order_globally,
    }
    if repo_rev is not None:
        payload["repo_rev"] = repo_rev
    if due_date is not None:
        payload["due_date"] = due_date
    return await _post_scan(payload, wait_for_completion, timeout_seconds)


@mcp.tool()
async def submit_batch(
    file: str,
    class_name: str,
    variants: list[dict[str, Any]],
    axes: list[dict[str, Any]] | None = None,
    num_repeats: int = 1,
    repo_rev: str | None = None,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
) -> list[dict[str, Any]]:
    """Submit many variants of one experiment in a SINGLE MCP call.

    This is the batch counterpart of submit_1d_scan / submit_multi_axis_scan: it
    fans out over a list of ``variants`` — each carrying its own ``fixed_params``
    — and submits one scan per variant on the same gated ndscan-building path
    (POST /api/scan). Use it whenever you would otherwise fire a run of
    near-identical submissions (e.g. a dozen filler runs, or the same experiment
    at a set of held-fixed parameter values): one call here replaces N separate
    submit calls, so there is no incentive to bypass the safety-gated MCP path
    with a hand-rolled REST loop.

    All variants share the experiment identity (``file``, ``class_name``),
    ``repo_rev``, ``pipeline``, ``flush`` and — importantly — a single
    ``priority``. Priority is deliberately batch-wide and cannot be set
    per-variant, so a negative-priority queue floor stays satisfied for the whole
    batch in one place. ``axes`` and ``num_repeats`` are batch-wide defaults that
    an individual variant may override.

    With the default empty ``axes`` each variant is a plain single submission
    (ndscan "single" no-axes mode — no scan). Provide shared ``axes`` (or
    per-variant ``axes``) to make each variant a scan instead.

    Args:
        file: Relative path to the experiment file, e.g. "scans/rabi.py".
        class_name: Python class name of the experiment, e.g. "RabiFlop".
        variants: List of per-variant dicts. Each dict may contain:
            - "fixed_params" (dict, usually required): {fqn: value} overrides to
              hold fixed for this variant. To disambiguate an FQN present at
              multiple instance paths, use {"value": <v>, "path": <instance_path>}
              instead of a bare value (same shape as submit_1d_scan's fixed_params).
            - "axes" (list, optional): override the batch ``axes`` for this
              variant. Each axis is {"fqn", "type", "range"} exactly as in
              submit_multi_axis_scan.
            - "num_repeats" (int, optional): override the batch ``num_repeats``.
            - "due_date" (float, optional): Unix timestamp; earliest run time for
              this variant.
        axes: Shared scan axes applied to every variant that does not override
            them. Default None/empty = no scan axis (each variant runs once).
            Each axis is {"fqn", "type", "range"} as in submit_multi_axis_scan.
        num_repeats: Shared repeat count for variants that do not override it
            (default 1).
        repo_rev: Git revision (commit hash, branch, or tag) to check out before
            building and running every variant. Omit or pass None to use the
            master's current revision.
        pipeline: Scheduling pipeline name for the whole batch (default "main").
        priority: Scheduling priority for the WHOLE batch — a single int applied
            to every variant (default 0). Cannot be overridden per variant.
        flush: Flush the pipeline before submitting (applied to every variant,
            default False).

    Returns:
        A list with one result dict per variant, in input order. Each has:
            - "index" (int): the variant's position in ``variants``.
            - "ok" (bool): whether that variant submitted successfully.
            - "rid" (int): the Run ID, present when ok is True.
            - "error" (str): the failure message, present when ok is False.
        A failure on one variant does NOT abort the rest — every variant is
        attempted and reported individually.
    """
    shared_axes = axes if axes is not None else []
    results: list[dict[str, Any]] = []
    for index, variant in enumerate(variants):
        try:
            if not isinstance(variant, dict):
                raise TypeError(f"variant must be a dict, got {type(variant).__name__}")
            payload: dict[str, Any] = {
                "file": file,
                "class_name": class_name,
                "axes": variant.get("axes", shared_axes),
                "fixed_params": variant.get("fixed_params"),
                "num_repeats": variant.get("num_repeats", num_repeats),
                "pipeline": pipeline,
                "priority": priority,
                "flush": flush,
            }
            if repo_rev is not None:
                payload["repo_rev"] = repo_rev
            if variant.get("due_date") is not None:
                payload["due_date"] = variant["due_date"]
            # Reuse the existing scan path so the whole batch stays on the gated,
            # ndscan-building POST /api/scan endpoint (never wait per variant).
            rid = await _post_scan(payload, wait_for_completion=False, timeout_seconds=600.0)
            results.append({"index": index, "ok": True, "rid": rid})
        except Exception as exc:  # noqa: BLE001 - report per-variant, don't abort the batch
            results.append({"index": index, "ok": False, "error": f"{type(exc).__name__}: {exc}"})
    return results


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
# Devices
# ---------------------------------------------------------------------------


@mcp.tool()
async def get_devices() -> dict[str, Any]:
    """Get the current ARTIQ device database (device_db).

    Returns a dict mapping device name -> device definition. This can be large
    on systems with many devices.
    """
    async with _client() as c:
        r = await c.get("/api/devices")
        r.raise_for_status()
        return r.json()


# ---------------------------------------------------------------------------
# Presets
#
# Read-only by design: presets/favourites (GET /api/presets) are a human UI
# affordance for the bench frontend's "quick check" and mobile favourites
# lists. There are deliberately no write tools (create/update/delete) here —
# an agent has no business silently creating or clobbering a human's saved
# scan configurations, so those stay a browser-only action. This is a
# decision, not a parity gap (see AGENTS.md's MCP Server section).
# ---------------------------------------------------------------------------


@mcp.tool()
async def list_presets(
    file: str | None = None,
    class_name: str | None = None,
    favourites_only: bool = False,
) -> dict[str, Any]:
    """List saved scan/session presets (read-only).

    Presets are a lab-wide, unauthenticated convenience the bench UI uses for
    its "quick check" menu and mobile favourites list — a saved combination of
    working-set parameters, pipeline, priority, repeats, and revision for a
    specific experiment.

    Args:
        file: Only return presets saved for this experiment file.
        class_name: Only return presets saved for this experiment class.
        favourites_only: Only return presets with favourite == True.

    Returns a dict with key 'presets': a list of preset dicts, each with 'id',
    'name', 'file', 'class_name', 'favourite', 'working_set' (opaque, frontend-
    defined), 'pipeline', 'priority', 'repeats', 'skip_on_error', 'revision',
    'created_at', 'updated_at'.
    """
    params: dict[str, Any] = {"favourites_only": favourites_only}
    if file is not None:
        params["file"] = file
    if class_name is not None:
        params["class_name"] = class_name
    async with _client() as c:
        r = await c.get("/api/presets", params=params)
        r.raise_for_status()
        return r.json()


@mcp.tool()
async def get_preset(preset_id: str) -> dict[str, Any]:
    """Get a single saved preset by id (read-only).

    Args:
        preset_id: The preset's server-generated id (from list_presets()).

    Returns the preset dict (see list_presets() for the field shapes).
    """
    async with _client() as c:
        r = await c.get("/api/presets", params={})
        r.raise_for_status()
        for preset in r.json().get("presets", []):
            if preset.get("id") == preset_id:
                return preset
    raise ValueError(f"Preset {preset_id!r} not found")


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
