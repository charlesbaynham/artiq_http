---
name: artiq-http
description: Use when interacting with an ARTIQ quantum physics control system via its HTTP API. Use when submitting experiments, checking schedules, reading datasets, or querying the experiment list from an ARTIQ master.
---

# ARTIQ HTTP MCP Tools

MCP tools for controlling an ARTIQ quantum physics experiment system via its HTTP API.

## Overview

When this connector is enabled, 10 MCP tools are available directly — no code or SDK required. Use them to discover experiments, submit runs, wait for results, read datasets, and check server health.

The MCP server runs as a remote HTTP service (streamable HTTP transport) and connects to an `artiq_http` backend instance. In the Docker Compose stack it runs as the `mcp` service and connects to the backend over the internal network at `http://backend:8000`. For local development you can also run it directly with `python -m mcp_server.server` and point it at `http://localhost:8000`.

## When to Use

Use these tools whenever you need to:

- Discover what experiments are available on an ARTIQ master
- Submit an experiment for execution
- Wait for an experiment to finish and inspect its outcome
- Read dataset values produced by an experiment
- Check whether the ARTIQ HTTP server is reachable

## Tools Reference

### `check_health()`

Check whether the ARTIQ HTTP server is reachable and connected to the ARTIQ master.

Returns a dict with `status` (str), `artiq_connected` (bool), and `details`.

---

### `list_experiments()`

List all experiments in the ARTIQ repository.

Returns a dict with:
- `experiments`: list of experiment entries (see below)
- `scanning`: `true` while the repo scan is still in progress
- `current_rev`: git revision string or null

Each experiment entry has: `name`, `file`, `class_name`, `arginfo`, `scheduler_defaults`.

---

### `search_experiments(query)`

Search experiments by name, file path, or class name (case-insensitive substring).

| Arg | Type | Description |
|---|---|---|
| `query` | str | Substring to search for |

Returns a filtered experiment list in the same format as `list_experiments()`.

---

### `get_experiment_defaults(file, class_name)`

Get the default argument values for a specific experiment.

| Arg | Type | Example |
|---|---|---|
| `file` | str | `"idle.py"`, `"scans/rabi.py"` |
| `class_name` | str | `"Idle"`, `"RabiFlop"` |

Returns a dict with `file`, `class_name`, and `arguments` (dict of name → default value).

---

### `get_schedule()`

Get the current experiment schedule — all queued and running experiments.

Returns a dict mapping RID (str) → schedule item. Each item has `pipeline`, `priority`, `status`, `expid`, `due_date`, `flush`.

---

### `submit_experiment(file, class_name, arguments?, pipeline?, priority?, flush?)`

Submit an experiment and return its RID immediately without waiting.

Use `submit_and_wait()` if you need confirmation that the experiment finished.

| Arg | Type | Default | Description |
|---|---|---|---|
| `file` | str | required | Experiment file path |
| `class_name` | str | required | Experiment class name |
| `arguments` | dict\|null | null | Argument overrides; null = use server defaults |
| `pipeline` | str | `"main"` | Scheduling pipeline |
| `priority` | int | `0` | Higher = runs sooner |
| `flush` | bool | `false` | Flush pipeline before submitting |

Returns the integer RID.

---

### `submit_and_wait(file, class_name, arguments?, pipeline?, priority?, flush?, timeout_seconds?)`

Submit an experiment and block until it completes (or the timeout expires).

Same args as `submit_experiment()`, plus:

| Arg | Type | Default | Description |
|---|---|---|---|
| `timeout_seconds` | float | `60.0` | Max seconds to wait (server caps at 300) |

Returns a dict with `rid` (int), `status` (str, e.g. `"completed"` or `"timeout"`), `timed_out` (bool).

---

### `cancel_experiment(rid, force?)`

Cancel a queued or running experiment.

| Arg | Type | Default | Description |
|---|---|---|---|
| `rid` | int | required | Run ID to cancel |
| `force` | bool | `false` | If true, forcibly delete; if false, request graceful termination |

---

### `list_dataset_names()`

List the names of all datasets currently held on the ARTIQ master. Returns a list of strings.

---

### `get_dataset_values(names)`

Get the current values of one or more ARTIQ datasets.

| Arg | Type | Description |
|---|---|---|
| `names` | list[str] | Dataset key names to retrieve |

Returns a dict mapping each name to its current value. Names that do not exist are silently omitted.

---

## Common Workflows

### Discover and run an experiment

```
1. search_experiments("idle")          → find the experiment entry
2. get_experiment_defaults(file, cls)  → fetch default arguments
3. submit_and_wait(file, cls, args)    → run it and wait for completion
4. get_dataset_values(["results"])     → read back datasets
```

### Fire-and-forget with RID tracking

```
1. submit_experiment(file, cls, args)  → get RID immediately
2. get_schedule()                      → poll until RID disappears from queue
```

### Check system status before running

```
1. check_health()  → confirm artiq_connected is true before submitting
```

## Error Handling

Tools raise `httpx.HTTPStatusError` for non-2xx responses.

Common status codes:
- `404` — experiment file/class not found, or RID not in queue
- `503` — ARTIQ master not connected (try `check_health()` to diagnose)
- `500` — ARTIQ master error

## Deployment

The MCP server is included in the Docker Compose stack as the `mcp` service. It reuses the backend image and runs `python -m mcp_server.server`.

Environment variables:
- `ARTIQ_HTTP_URL` — URL of the artiq_http backend (default: `http://localhost:8000`)
- `MCP_PORT` — Port to serve on (default: `8001`)

### Connecting

In Claude Code, use `.mcp.json`:
```json
{
  "artiq": {
    "url": "http://localhost:8001"
  }
}
```

In Claude desktop: Settings → Connectors → Add custom connector → `http://your-server:8001`

## Key Response Shapes

| Response | Fields |
|---|---|
| experiment entry | `name`, `file`, `class_name`, `arginfo`, `argument_ui`, `scheduler_defaults` |
| experiment defaults | `file`, `class_name`, `arguments: dict` |
| schedule item | `pipeline`, `priority`, `due_date`, `flush`, `status`, `repo_msg`, `expid` |
| submit_and_wait result | `rid: int`, `status: str`, `timed_out: bool` |
