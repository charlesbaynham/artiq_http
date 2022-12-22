---
jupyter:
  jupytext:
    formats: ipynb,md,py:percent
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.3'
      jupytext_version: 1.14.4
  kernelspec:
    display_name: Python 3 (ipykernel)
    language: python
    name: python3
---

ARTIQ via HTTP
=====

The goal is to serve an RESTful API for ARTIQ. To do this, I'll set up a FastAPI server which runs as a controller and which interfaces to artiq_master through sipyco. First, though, I'll mess around a bit here until I have a plan.

```python
from sipyco.sync_struct import Subscriber
from sipyco.pc_rpc import Client
import asyncio
import logging
import time
from dateutil.parser import parse as parse_date

SERVER = "labserver"


async def get_dict(host, notifier_name, port=3250, timeout=3.0):
    d = dict()
    update_occured = asyncio.Event()

    def init_d(x):
        d.clear()
        d.update(x)
        return d

    def register_update(mod):
        update_occured.set()

    subscriber = Subscriber(notifier_name, target_builder=init_d,
                            notify_cb=register_update,
                            disconnect_cb=None)

    asyncio.create_task(subscriber.connect(host, port))

    try:
        await asyncio.wait_for(update_occured.wait(), timeout=timeout)
    finally:
        await subscriber.close()

    return d
```


```python
await get_dict(SERVER, "schedule")
```

```python
await get_dict(SERVER, "devices")
```

```python
await get_dict(SERVER, "datasets")
```


```python
async def submit_experiment(server, target_name, args, port=3251):
    remote = AsyncioClient(server, port, target_name)
    try:
        expid = {
            "log_level": logging.WARNING,  # + args.quiet*10 - args.verbose*10,
            "class_name": args.class_name,
            "arguments": args.arguments,
        }

        expid["file"] = args.file
        if args.repository:
            expid["repo_rev"] = args.revision

        if args.timed is None:
            due_date = None
        else:
            due_date = time.mktime(parse_date(args.timed).timetuple())
        rid = remote.submit(args.pipeline, expid,
                            args.priority, due_date, args.flush)

        return rid
    finally:
        remote.close_rpc()
```

```python
async def cancel_experiment(server, rid, force=False, port=3251):
    remote = Client(server, port, "master_schedule")
    try:
        if not force:
            remote.request_termination(rid)
        else:
            remote.delete(rid)
    finally:
        remote.close_rpc()
```


```python
await get_dict(SERVER, "schedule")
```

```python
await cancel_experiment(SERVER, 913)
```

```python
await get_dict(SERVER, "schedule")
```

```python

```
