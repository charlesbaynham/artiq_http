from sipyco.pc_rpc import Client

from ..config import config
from .models import ExpID


class ExperimentNotFoundError(Exception):
    """The experiment could not be examined at the requested revision.

    Raised when the master was reached but the ``examine`` worker failed —
    typically because the experiment file does not exist at that git
    revision (not all experiments exist on all branches). This is distinct
    from a failure to reach the master at all, which propagates as the
    original transport/connection error so callers can map it to a 503.
    """


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
        rid = remote.submit(pipeline, expid.model_dump(), priority, due_date, flush)
        return rid
    finally:
        remote.close_rpc()


async def examine_experiment(filename: str, revision: str | None = None) -> dict:
    """Re-examine an experiment at a given repository revision.

    Mirrors the ARTIQ dashboard's "Recompute all arguments": it asks the master's
    ``experiment_db`` controller to check out *revision* into a temporary directory
    and run the worker ``examine``, returning a description keyed by class name. Each
    value is a dict with ``name``, ``arginfo``, ``argument_ui`` and
    ``scheduler_defaults``.

    Args:
        filename: Experiment file path, relative to the repository root.
        revision: Git revision/branch/tag to examine. ``None`` means the master's
            current revision.

    Returns:
        dict: Mapping of class name to its examined description.
    """
    rpc_name = "experiment_db"
    if config["old_artiq_support"]:
        rpc_name = "master_experiment_db"

    remote = Client(config["host"], config["port_clients"], rpc_name)
    try:
        # use_repository=True so the master resolves and checks out the revision.
        return remote.examine(filename, True, revision)
    except (OSError, EOFError):
        # Transport/connection failure — the master is unreachable. Let this
        # propagate so callers can surface it as a 503.
        raise
    except Exception as e:
        # The examine ran on the master but failed. The common cause is that
        # the file does not exist at this revision (experiments differ between
        # branches); the worker raises rather than returning an empty result.
        raise ExperimentNotFoundError(f"Could not examine '{filename}' at revision {revision or 'current'}: {e}") from e
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
