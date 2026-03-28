# Skill: artiq_http_client SDK

## When to use this SDK

ARTIQ (Advanced Real-Time Infrastructure for Quantum physics) is a control system for quantum computing experiments. The `artiq_http_client` SDK is the correct tool whenever an agent needs to:

- Discover available experiments on an ARTIQ master
- Submit experiments for execution
- Wait for an experiment to finish and inspect its outcome
- Read dataset values produced by an experiment
- Check whether the ARTIQ HTTP server is reachable

Use this SDK instead of raw HTTP calls. It wraps the ARTIQ HTTP API, handles URL encoding, deserialises responses into typed dataclasses, and propagates errors via `httpx`.

---

## Installation

From the project root:

```bash
pip install -e sdk/
```

---

## Import and instantiation

```python
from artiq_http_client import ArtiqClient
from artiq_http_client._models import ExpID

# Use as a context manager so the underlying HTTP connection is closed cleanly.
with ArtiqClient("http://localhost:8000") as client:
    ...

# Or manage the lifecycle manually:
client = ArtiqClient("http://localhost:8000")
# ... use client ...
client.close()
```

`ArtiqClient(base_url, timeout)` — `base_url` defaults to `"http://localhost:8000"`, `timeout` (seconds) defaults to `30.0`.

---

## Client resource layout

| Attribute | Type | Purpose |
|---|---|---|
| `client.explist` | `ExplistClient` | Browse and search the experiment repository |
| `client.schedule` | `ScheduleClient` | Submit experiments and inspect the run queue |
| `client.datasets` | `DatasetsClient` | Read dataset values written by experiments |
| `client.health` | `HealthClient` | Check server liveness |

---

## API reference

### `client.explist`

```python
# List all experiments
result: ExperimentList = client.explist.list()

# Search by name/file (case-insensitive substring match)
result: ExperimentList = client.explist.search(q="idle")
# result.experiments  -> list[ExperimentEntry]
# result.scanning     -> bool (True while the repo scan is in progress)
# result.current_rev  -> Optional[str] git revision

# Each ExperimentEntry has:
#   .name, .file, .class_name, .arginfo, .argument_ui, .scheduler_defaults

# Fetch default argument values for a specific experiment
defaults: ExperimentDefaults = client.explist.get_defaults(
    file="idle.py", class_name="Idle"
)
# defaults.arguments -> dict of argument name -> default value
```

### `client.schedule`

```python
from artiq_http_client._models import ExpID

expid = ExpID(
    file="idle.py",
    class_name="Idle",
    arguments={"duration": 100},   # optional; omit to use server defaults
)

# Submit only — returns the Run ID (RID) immediately
rid: int = client.schedule.submit(expid, pipeline="main", priority=0, flush=False)

# Submit and block until the experiment finishes (or timeout expires)
result: SubmitAndWaitResult = client.schedule.submit_and_wait(expid, timeout=60)
# result.rid        -> int
# result.status     -> str  e.g. "completed", "cancelled", "failed"
# result.timed_out  -> bool

# Inspect the queue
queue: dict[int, ScheduleItem] = client.schedule.list()
item: ScheduleItem = client.schedule.get(rid)
# item.status  -> str  e.g. "preparing", "running", "deleting"

# Cancel a run
client.schedule.cancel(rid, force=False)
```

### `client.datasets`

```python
# All datasets
all_datasets: dict[str, Any] = client.datasets.list()

# Dataset names only
names: list[str] = client.datasets.names()

# Values for specific keys
values: dict[str, Any] = client.datasets.values(["results", "counts"])
```

### `client.health`

```python
status: dict[str, Any] = client.health.get()
```

---

## End-to-end example

```python
import httpx
from artiq_http_client import ArtiqClient
from artiq_http_client._models import ExpID

with ArtiqClient("http://localhost:8000") as client:

    # 1. Find experiments whose name contains "idle"
    results = client.explist.search(q="idle")
    if not results.experiments:
        raise RuntimeError("No idle experiment found")

    entry = results.experiments[0]
    print(f"Found: {entry.name}  ({entry.file} :: {entry.class_name})")

    # 2. Fetch default arguments
    defaults = client.explist.get_defaults(
        file=entry.file, class_name=entry.class_name
    )
    print("Default arguments:", defaults.arguments)

    # 3. Build an ExpID — pass custom arguments or omit to use defaults
    expid = ExpID(
        file=entry.file,
        class_name=entry.class_name,
        arguments=defaults.arguments,
    )

    # 4. Submit and wait for completion (60 s timeout)
    result = client.schedule.submit_and_wait(expid, timeout=60)
    print(f"RID {result.rid} finished with status '{result.status}'")

    if result.timed_out:
        print("Warning: experiment did not finish within the timeout")

    # 5. Read back datasets written by the experiment
    data = client.datasets.values(["results"])
    print("results dataset:", data.get("results"))
```

---

## Error handling

Every method calls `response.raise_for_status()` internally. Any non-2xx HTTP response raises `httpx.HTTPStatusError`.

```python
import httpx
from artiq_http_client import ArtiqClient

with ArtiqClient("http://localhost:8000") as client:
    try:
        defaults = client.explist.get_defaults(file="missing.py", class_name="Gone")
    except httpx.HTTPStatusError as exc:
        print(f"HTTP {exc.response.status_code}: {exc.response.text}")
    except httpx.RequestError as exc:
        # Network-level failure (connection refused, timeout, etc.)
        print(f"Request failed: {exc}")
```

Common status codes:
- `404` — experiment file/class not found, or RID not in queue
- `408` / `504` — server-side timeout (distinct from `result.timed_out`)
- `500` — ARTIQ master error

---

## Key model types

| Model | Fields |
|---|---|
| `ExpID` | `file`, `class_name`, `log_level` (default 30), `arguments`, `repo_rev` |
| `ExperimentList` | `experiments: list[ExperimentEntry]`, `scanning: bool`, `current_rev` |
| `ExperimentEntry` | `name`, `file`, `class_name`, `arginfo`, `argument_ui`, `scheduler_defaults` |
| `ExperimentDefaults` | `file`, `class_name`, `arguments: dict` |
| `ScheduleItem` | `pipeline`, `priority`, `due_date`, `flush`, `status`, `repo_msg`, `expid` |
| `SubmitAndWaitResult` | `rid: int`, `status: str`, `timed_out: bool` |
