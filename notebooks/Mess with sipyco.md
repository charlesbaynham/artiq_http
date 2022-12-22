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
from sipyco.pc_rpc import AsyncioClient
import asyncio

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
def submit_experiment():
    remote = Client(args.server, port, target_name)
        try:
            globals()["_action_" + action](remote, args)
        finally:
            remote.close_rpc()
```

```python
remote = Client(args.server, port, target_name)
        try:
            globals()["_action_" + action](remote, args)
        finally:
            remote.close_rpc()
```
