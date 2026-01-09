from sipyco.pc_rpc import Client

from ..config import config
from .models import ExpID


async def submit_experiment(
    expid: ExpID,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    due_date: float = None,
) -> int:
    rpc_name = "schedule"
    if config["old_artiq_support"]:
        rpc_name = "master_schedule"

    remote = Client(config["host"], config["port_clients"], rpc_name)
    try:
        rid = remote.submit(pipeline, expid.dict(), priority, due_date, flush)
        return rid
    finally:
        remote.close_rpc()


async def cancel_experiment(rid, force=False):
    rpc_name = "schedule"
    if config["old_artiq_support"]:
        rpc_name = "master_schedule"
    remote = Client(config["host"], config["port_clients"], rpc_name)

    try:
        if not force:
            remote.request_termination(rid)
        else:
            remote.delete(rid)
    finally:
        remote.close_rpc()
