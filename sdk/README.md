# artiq_http_client

Python client SDK for the ARTIQ HTTP server.

## Installation

```bash
pip install -e /path/to/artiq_http/sdk
```

Or from within the project root:

```bash
pip install -e sdk/
```

## Usage

```python
from artiq_http_client import ArtiqClient, ExpID

# Use as a context manager (recommended)
with ArtiqClient("http://localhost:8000") as client:
    # Health check
    health = client.health.get()
    print(health["status"], health["artiq_connected"])

    # List experiments
    explist = client.explist.list()
    for exp in explist.experiments:
        print(exp.name, exp.file, exp.class_name)

    # Search experiments
    results = client.explist.search("my_experiment")

    # Get experiment defaults
    defaults = client.explist.get_defaults("repo/my_exp.py", "MyExperiment")

    # List scheduled experiments
    schedule = client.schedule.list()
    for rid, item in schedule.items():
        print(rid, item.status)

    # Submit an experiment
    expid = ExpID(file="repo/my_exp.py", class_name="MyExperiment")
    rid = client.schedule.submit(expid, pipeline="main", priority=0)
    print(f"Submitted with RID {rid}")

    # Submit and wait for completion
    result = client.schedule.submit_and_wait(expid, timeout=120.0)
    print(f"RID {result.rid} finished with status: {result.status}")

    # Cancel an experiment
    client.schedule.cancel(rid, force=False)

    # List datasets
    datasets = client.datasets.list()
    names = client.datasets.names()
    values = client.datasets.values(["dataset1", "dataset2"])
```

## API Reference

### `ArtiqClient(base_url, timeout)`

Main client class. All sub-clients are accessible as properties.

| Property | Description |
|----------|-------------|
| `.schedule` | Schedule management |
| `.explist` | Experiment list |
| `.datasets` | Dataset access |
| `.health` | Health check |

### Schedule Methods

| Method | Description |
|--------|-------------|
| `schedule.list()` | Get all scheduled experiments |
| `schedule.get(rid)` | Get a single scheduled experiment |
| `schedule.submit(expid, pipeline, priority, flush, due_date)` | Submit experiment, returns RID |
| `schedule.submit_and_wait(expid, timeout, ...)` | Submit and wait for completion |
| `schedule.cancel(rid, force)` | Cancel a scheduled experiment |

### Explist Methods

| Method | Description |
|--------|-------------|
| `explist.list()` | Get full experiment list |
| `explist.search(q)` | Search experiments by query |
| `explist.get_defaults(file, class_name)` | Get default arguments for an experiment |

### Datasets Methods

| Method | Description |
|--------|-------------|
| `datasets.list()` | Get all datasets |
| `datasets.names()` | Get all dataset names |
| `datasets.values(names)` | Get values for specified dataset names |

### Health Methods

| Method | Description |
|--------|-------------|
| `health.get()` | Get server health status |

## Error Handling

Non-2xx HTTP responses raise `httpx.HTTPStatusError`:

```python
import httpx
from artiq_http_client import ArtiqClient

with ArtiqClient() as client:
    try:
        item = client.schedule.get(9999)
    except httpx.HTTPStatusError as e:
        print(f"HTTP {e.response.status_code}: {e.response.text}")
```
