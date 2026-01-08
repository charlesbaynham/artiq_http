from sipyco.pc_rpc import Client

from ..config import config
from .models import ExpID

SERVER = "labserver"


async def submit_experiment(
    expid: ExpID,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    due_date: float = None,
) -> int:
    remote = Client(config["host"], config["port_clients"], "master_schedule")
    try:
        rid = remote.submit(pipeline, expid.dict(), priority, due_date, flush)
        return rid
    finally:
        remote.close_rpc()


async def cancel_experiment(rid, force=False):
    remote = Client(config["host"], config["port_clients"], "master_schedule")
    try:
        if not force:
            remote.request_termination(rid)
        else:
            remote.delete(rid)
    finally:
        remote.close_rpc()
