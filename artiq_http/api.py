import asyncio
import logging
import re
from contextlib import asynccontextmanager
from typing import Any, Dict

import pydantic
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import artiq_api as api
from . import sse
from .config import config

logger = logging.getLogger(__name__)


# Register numpy encoders with FastAPI's jsonable_encoder
def _register_numpy_encoders():
    """Register numpy types with FastAPI's encoders"""
    try:
        import numpy as np

        ENCODERS_BY_TYPE[np.ndarray] = lambda x: x.tolist()
        ENCODERS_BY_TYPE[np.integer] = int
        ENCODERS_BY_TYPE[np.int8] = int
        ENCODERS_BY_TYPE[np.int16] = int
        ENCODERS_BY_TYPE[np.int32] = int
        ENCODERS_BY_TYPE[np.int64] = int
        ENCODERS_BY_TYPE[np.uint8] = int
        ENCODERS_BY_TYPE[np.uint16] = int
        ENCODERS_BY_TYPE[np.uint32] = int
        ENCODERS_BY_TYPE[np.uint64] = int
        ENCODERS_BY_TYPE[np.floating] = float
        ENCODERS_BY_TYPE[np.float16] = float
        ENCODERS_BY_TYPE[np.float32] = float
        ENCODERS_BY_TYPE[np.float64] = float
        ENCODERS_BY_TYPE[np.bool_] = bool
    except ImportError:
        pass


_register_numpy_encoders()


class NumpyJSONResponse(JSONResponse):
    """Custom JSONResponse that handles numpy types"""

    def render(self, content: Any) -> bytes:
        import json
        import math

        import numpy as np

        def sanitize_value(obj):
            """Recursively sanitize values to be JSON compliant"""
            if isinstance(obj, dict):
                return {k: sanitize_value(v) for k, v in obj.items()}
            elif isinstance(obj, (list, tuple)):
                return [sanitize_value(item) for item in obj]
            elif isinstance(obj, float):
                # Handle NaN and Infinity for regular Python floats
                if math.isnan(obj) or math.isinf(obj):
                    return None
                return obj
            elif isinstance(obj, np.ndarray):
                # Convert to list first, then sanitize
                return sanitize_value(obj.tolist())
            elif isinstance(
                obj,
                (
                    np.integer,
                    np.int8,
                    np.int16,
                    np.int32,
                    np.int64,
                    np.uint8,
                    np.uint16,
                    np.uint32,
                    np.uint64,
                ),
            ):
                return int(obj)
            elif isinstance(obj, (np.floating, np.float16, np.float32, np.float64)):
                value = float(obj)
                # Handle NaN and Infinity for numpy floats
                if math.isnan(value) or math.isinf(value):
                    return None
                return value
            elif isinstance(obj, np.bool_):
                return bool(obj)
            return obj

        # Sanitize the content first
        sanitized_content = sanitize_value(content)

        return json.dumps(
            sanitized_content,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
        ).encode("utf-8")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown"""
    from . import artiq_api

    if config.get("mock"):
        from .mock_backend import MockSubscriberManager

        logger.info("Mock mode: starting mock backend")
        # Swap in the mock manager, restoring the original singleton on teardown so
        # mock mode does not leak into other consumers (notably realserver tests that
        # share the process-wide subscriber_manager).
        previous = artiq_api.persistent_subscriber.subscriber_manager
        mock_mgr = MockSubscriberManager()
        artiq_api.persistent_subscriber.subscriber_manager = mock_mgr
        await mock_mgr.start()
        try:
            yield
        finally:
            await mock_mgr.stop()
            artiq_api.persistent_subscriber.subscriber_manager = previous
        return

    # Startup
    logger.info("Starting persistent subscribers...")
    await artiq_api.persistent_subscriber.subscriber_manager.start()

    # Wait for subscribers to initialize (with timeout)
    logger.info("Waiting for subscribers to initialize...")
    initialized = await artiq_api.persistent_subscriber.subscriber_manager.wait_for_init(timeout=10.0)
    if initialized:
        logger.info("Persistent subscribers started and initialized successfully")
    else:
        logger.warning(
            "Persistent subscribers started but initialization timed out - API will return 503 until connected"
        )

    yield

    # Shutdown
    logger.info("Stopping persistent subscribers...")
    await artiq_api.persistent_subscriber.subscriber_manager.stop()
    logger.info("Persistent subscribers stopped successfully")


app = FastAPI(default_response_class=NumpyJSONResponse, lifespan=lifespan)

router = APIRouter()

origins = [
    "http://localhost",
    "http://localhost:5172",
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/schedule")
async def get_schedule() -> Dict[int, api.models.ScheduleItem]:
    return await api.notifiers.get_schedule()


@router.get("/devices")
async def get_devices() -> dict:
    """Get the current device_db

    Returns:
        dict: ARTIQ Device_DB
    """
    return await api.notifiers.get_devices()


@router.get("/datasets", response_model=None)
async def get_datasets():
    """Get all existing ARTIQ datasets

    This method might return a large output

    Returns:
        dict: All broadcasted ARTIQ datasets
    """
    return await api.notifiers.get_datasets()


@router.get("/datasets/names")
async def get_dataset_names():
    """Get list of all dataset names (keys only)

    Returns a lightweight list of dataset names without their values,
    enabling efficient browsing and searching.

    Returns:
        dict: {"names": ["dataset1", "dataset2", ...]}
    """
    datasets = await api.notifiers.get_datasets()
    return {"names": list(datasets.keys())}


@router.get("/datasets/values", response_model=None)
async def get_dataset_values(names: str):
    """Get values for specific datasets

    Args:
        names: Comma-separated list of dataset names to fetch

    Returns:
        dict: Requested datasets with their values
    """
    # Parse comma-separated names
    requested_names = [name.strip() for name in names.split(",") if name.strip()]

    # Get all datasets from persistent subscriber
    all_datasets = await api.notifiers.get_datasets()

    # Filter to only requested datasets
    result = {}
    for name in requested_names:
        if name in all_datasets:
            result[name] = all_datasets[name]

    return result


@router.get("/logs")
async def get_logs(
    source_regex: str | None = None,
    message_regex: str | None = None,
    min_level: int | None = None,
    max_level: int | None = None,
    since: float | None = None,
    until: float | None = None,
    limit: int | None = None,
) -> api.models.LogList:
    """Return the current buffered ARTIQ system log entries with optional filtering.

    Each entry is validated against :class:`LogEntry`; entries whose shape
    differs are returned as-is so the endpoint stays usable across ARTIQ
    version variations.

    Query parameters:
      source_regex:  Regex applied to the ``source`` field.
      message_regex: Regex applied to the ``message`` field.
      min_level:     Minimum ``level`` (inclusive).
      max_level:     Maximum ``level`` (inclusive).
      since:         Minimum ``timestamp`` (inclusive).
      until:         Maximum ``timestamp`` (inclusive).
      limit:         Maximum number of entries to return.
    """
    compiled: dict[str, re.Pattern[str]] = {}
    for name, pattern in (
        ("source_regex", source_regex),
        ("message_regex", message_regex),
    ):
        if pattern is not None:
            try:
                compiled[name] = re.compile(pattern)
            except re.error as exc:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid regex for {name}: {exc}",
                )

    raw_logs = await api.notifiers.get_logs()
    entries: list = []
    for entry in raw_logs:
        if not isinstance(entry, dict):
            continue

        try:
            validated = api.models.LogEntry.model_validate(entry)
            entry = validated.model_dump()
        except pydantic.ValidationError:
            pass

        # Apply field-based filters.
        if min_level is not None and entry.get("level", float("-inf")) < min_level:
            continue
        if max_level is not None and entry.get("level", float("inf")) > max_level:
            continue
        if since is not None and entry.get("timestamp", float("inf")) < since:
            continue
        if until is not None and entry.get("timestamp", float("-inf")) > until:
            continue
        if "source_regex" in compiled and not compiled["source_regex"].search(str(entry.get("source", ""))):
            continue
        if "message_regex" in compiled and not compiled["message_regex"].search(str(entry.get("message", ""))):
            continue

        entries.append(entry)

        if limit is not None and len(entries) >= limit:
            break

    return api.models.LogList(logs=entries)


@router.get("/health")
async def get_health():
    """Get backend health and ARTIQ connection status

    Returns:
        dict: Health status including ARTIQ connection state
    """
    # Check connection status of all subscribers
    subscribers = api.persistent_subscriber.subscriber_manager._subscribers
    details = {}
    connected_count = 0

    for name, subscriber in subscribers.items():
        is_connected = subscriber.is_connected()
        details[name] = is_connected
        if is_connected:
            connected_count += 1

    total_count = len(subscribers)

    # Determine overall status
    if connected_count == total_count:
        status = "healthy"
        artiq_connected = True
    elif connected_count > 0:
        status = "degraded"
        artiq_connected = True
    else:
        status = "unhealthy"
        artiq_connected = False

    return {
        "status": status,
        "artiq_connected": artiq_connected,
        "details": details,
    }


@router.post("/cancel")
async def cancel_experiment(rid: int, force: bool = False) -> None:
    """Cancel a running experiment

    Args:
        rid (int): RID of the experiment to cancel
        force (bool): If True, forcibly close the experiment instead of requesting closure
    """
    if config.get("mock"):
        raise HTTPException(503, "Mock mode: experiment control not available")

    schedule = await api.notifiers.get_schedule()

    if rid not in schedule:
        raise HTTPException(404, f"RID {rid} not found in schedule")

    return await api.control_schedule.cancel_experiment(rid, force)


_REQUIRED_EXPERIMENT_FIELDS = {"name", "file", "class_name"}


def _filter_experiment_fields(
    exp: api.models.ExperimentEntry,
    fields: set[str],
    full: bool,
) -> api.models.ExperimentEntry:
    """Return a new ExperimentEntry containing only *fields*.

    When ``arginfo`` is in *fields* and ``full`` is False, the ndscan_params
    inside arginfo are filtered to only the ``always_shown`` parameters.
    """
    data = exp.model_dump()
    filtered: dict[str, Any] = {k: v for k, v in data.items() if k in (fields | _REQUIRED_EXPERIMENT_FIELDS)}
    if "arginfo" in filtered and not full:
        filtered["arginfo"] = api.notifiers._filter_ndscan_always_shown(filtered["arginfo"])
    return api.models.ExperimentEntry.model_validate(filtered)


@router.get("/explist")
async def get_explist(
    fields: str = "name,file,class_name,docstring",
    full: bool = False,
) -> api.models.ExperimentList:
    requested = {f.strip() for f in fields.split(",") if f.strip()}
    explist = await api.notifiers.get_explist()
    return api.models.ExperimentList(
        current_rev=explist.current_rev,
        scanning=explist.scanning,
        experiments=[_filter_experiment_fields(exp, requested, full) for exp in explist.experiments],
    )


@router.get("/schedule/{rid}")
async def get_schedule_item(rid: int) -> api.models.ScheduleItem:
    schedule = await api.notifiers.get_schedule()
    if rid not in schedule:
        raise HTTPException(404, f"RID {rid} not found in schedule")
    return schedule[rid]


# NOTE: must be registered before /{file:path} routes to avoid {file:path} consuming "search"
@router.get("/explist/search")
async def search_explist(
    q: str = "",
    fields: str = "name,file,class_name,docstring",
    full: bool = False,
) -> api.models.ExperimentList:
    requested = {f.strip() for f in fields.split(",") if f.strip()}
    explist = await api.notifiers.get_explist()
    if not q:
        filtered_exps = explist.experiments
    else:
        q_lower = q.lower()
        filtered_exps = [
            exp
            for exp in explist.experiments
            if q_lower in exp.name.lower() or q_lower in exp.file.lower() or q_lower in exp.class_name.lower()
        ]
    return api.models.ExperimentList(
        current_rev=explist.current_rev,
        scanning=explist.scanning,
        experiments=[_filter_experiment_fields(exp, requested, full) for exp in filtered_exps],
    )


@router.get("/explist/{file:path}/{class_name}/defaults")
async def get_explist_defaults(file: str, class_name: str) -> api.models.ExperimentDefaults:
    explist = await api.notifiers.get_explist()
    for exp in explist.experiments:
        if exp.file == file and exp.class_name == class_name:
            return api.models.ExperimentDefaults(
                file=exp.file,
                class_name=exp.class_name,
                arguments=api.notifiers.extract_arginfo_defaults(exp.arginfo),
            )
    raise HTTPException(404, f"Experiment {file}/{class_name} not found")


@router.get("/explist/{file:path}/{class_name}/arginfo")
async def get_explist_arginfo(file: str, class_name: str) -> api.models.ExperimentArginfo:
    """Return the full arginfo (including complete ndscan_params) for a single experiment."""
    explist = await api.notifiers.get_explist()
    for exp in explist.experiments:
        if exp.file == file and exp.class_name == class_name:
            return api.models.ExperimentArginfo(
                file=exp.file,
                class_name=exp.class_name,
                arginfo=exp.arginfo,
            )
    raise HTTPException(404, f"Experiment {file}/{class_name} not found")


@router.post("/explist/{file:path}/{class_name}/recompute")
async def recompute_explist_arginfo(
    file: str,
    class_name: str,
    revision: str | None = None,
) -> api.models.ExperimentArginfo:
    """Re-examine an experiment at *revision* and return its fresh arginfo.

    This is the artiq_http equivalent of the ARTIQ dashboard's "Recompute all
    arguments" button: it re-evaluates which arguments exist and their defaults for
    the experiment as defined at the given git revision/branch, rather than reading
    the master's statically-scanned current revision. Pass the returned ``revision``
    as ``repo_rev`` when submitting so the experiment actually runs from it.

    Args:
        file: Experiment file path, relative to the repository root.
        class_name: Experiment class name.
        revision: Git revision/branch/tag to examine. Omit to use the master's
            current revision.
    """
    if config.get("mock"):
        from .artiq_api.persistent_subscriber import subscriber_manager

        arginfo = subscriber_manager.examine_experiment(file, class_name, revision)
        if arginfo is None:
            raise HTTPException(404, f"Experiment {file}/{class_name} not found")
        return api.models.ExperimentArginfo(file=file, class_name=class_name, arginfo=arginfo)

    try:
        description = await api.control_schedule.examine_experiment(file, revision)
    except Exception as e:  # noqa: BLE001 - surface any RPC/connection failure as 503
        raise HTTPException(503, f"Failed to examine experiment: {str(e)}")

    if class_name not in description:
        raise HTTPException(404, f"Experiment {file}/{class_name} not found at revision {revision or 'current'}")

    return api.models.ExperimentArginfo(
        file=file,
        class_name=class_name,
        arginfo=description[class_name].get("arginfo", {}),
    )


async def _validate_expid_ndscan(expid: api.models.ExpID) -> None:
    """Validate ndscan_params in *expid* and raise 422 on failure."""
    arguments = expid.arguments or {}
    if "ndscan_params" not in arguments:
        return

    # Fetch arginfo from explist for cross-checking FQNs
    arginfo = None
    explist = await api.notifiers.get_explist()
    for exp in explist.experiments:
        if exp.file == expid.file and exp.class_name == expid.class_name:
            arginfo = exp.arginfo
            break

    error = api.ndscan_validation.validate_ndscan_params(arguments, arginfo)
    if error:
        raise HTTPException(422, error)


async def _rid_failure_from_logs(rid: int) -> str | None:
    """Return the first line of a logged failure for *rid*, or None.

    A run that dies in the prepare or run stage is *deleted* from the schedule,
    which is indistinguishable from successful completion by schedule-presence
    alone. ARTIQ does, however, log the failure at ERROR level — the scheduler
    emits "...got worker exception ..., deleting RID <rid>" and the worker logs
    "Terminating with exception..." under source "worker(<rid>,...)". We scan the
    buffered logs for those so a crash is reported as a failure rather than a
    completion.

    The level gate is essential: a *normal* completion also deletes the RID and
    the scheduler logs "deleting RID <rid>..." for it, but at DEBUG level. Only
    an ERROR-level log signals an actual failure, so matching the "deleting RID"
    marker without the level check would misreport every clean run as failed.
    """
    try:
        logs = await api.notifiers.get_logs()
    except Exception:
        # Logs unavailable (e.g. subscriber not connected) — can't prove a
        # failure, so don't manufacture one.
        return None

    worker_src = f"worker({rid},"
    delete_marker = f"deleting RID {rid}"
    for entry in logs:
        message = str(entry.get("message", ""))
        source = str(entry.get("source", ""))
        level = entry.get("level", 0) or 0
        if level < logging.ERROR:
            continue
        is_delete = delete_marker in message
        is_worker_error = worker_src in source
        if is_delete or is_worker_error:
            return message.strip().splitlines()[0][:500]
    return None


async def _wait_for_rid_completion(rid: int, timeout: float) -> api.models.SubmitAndWaitResult:
    """Poll the schedule until *rid* completes or *timeout* elapses.

    The schedule is mirrored from the ARTIQ master by an asynchronous
    subscriber, so immediately after submit() returns the new RID may not yet
    be present in our local snapshot. If we treated that initial absence as
    completion we would return early while the experiment is still queued or
    running (the bug this helper exists to avoid). Instead we first wait for the
    RID to *appear* in the schedule, and only then treat its later disappearance
    as completion.

    An experiment that finishes very quickly might come and go before we ever
    observe it. To avoid blocking until the timeout in that case, if the RID
    never shows up within a short grace period we assume it already finished.

    "Left the schedule" alone does NOT mean success: an experiment that crashes
    in the prepare/run stage is also removed from the schedule. Before reporting
    completion we therefore check the logs for a failure of this RID and report
    ``status="failed"`` (with the error) if one is found.
    """
    appear_grace = min(5.0, timeout)
    poll_interval = 1.0

    elapsed = 0.0
    seen_in_schedule = False
    while elapsed < timeout:
        schedule = await api.notifiers.get_schedule()
        if rid in schedule:
            seen_in_schedule = True
        elif seen_in_schedule or elapsed >= appear_grace:
            # Either we observed it running and it has now left the schedule, or
            # it never appeared within the grace period (fast experiment). The
            # disappearance might be success OR a crash — disambiguate via logs.
            error = await _rid_failure_from_logs(rid)
            if error is not None:
                return api.models.SubmitAndWaitResult(rid=rid, status="failed", timed_out=False, error=error)
            return api.models.SubmitAndWaitResult(rid=rid, status="completed", timed_out=False)
        await asyncio.sleep(poll_interval)
        elapsed += poll_interval

    return api.models.SubmitAndWaitResult(rid=rid, status="timeout", timed_out=True)


@router.post("/schedule")
async def submit_experiment(
    expid: api.models.ExpID,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    due_date: float = None,
    wait_for_completion: bool = False,
    timeout: float = 600.0,
) -> int | api.models.SubmitAndWaitResult:
    """Submit an experiment.

    Args:
        expid: Experiment ID specification
        pipeline: Pipeline name (default: "main")
        priority: Scheduling priority (default: 0)
        flush: Whether to flush the pipeline (default: False)
        due_date: Optional due date as Unix timestamp
        wait_for_completion: If True, block until the experiment finishes
            before returning (default: False)
        timeout: Max seconds to wait when ``wait_for_completion`` is True
            (default: 600, max: 21600)

    Returns:
        The integer Run ID (RID) when ``wait_for_completion`` is False, or a
        SubmitAndWaitResult with *rid*, *status*, *timed_out*, and *error*
        fields when it is True.
    """
    if config.get("mock"):
        raise HTTPException(503, "Mock mode: experiment control not available")

    await _validate_expid_ndscan(expid)
    try:
        rid = await api.control_schedule.submit_experiment(
            expid,
            pipeline,
            priority,
            flush,
            due_date,
        )
    except ValueError as e:
        raise HTTPException(422, str(e))

    if wait_for_completion:
        return await _wait_for_rid_completion(rid, min(timeout, 21600.0))
    return rid


async def _build_scan_expid(req: api.models.ScanSubmitRequest) -> api.models.ExpID:
    """Build an ExpID with ndscan_params from a high-level ScanSubmitRequest.

    Raises HTTPException 404 if the experiment is not found, 422 if it has no
    ndscan schemata or if the scan parameters are otherwise invalid.
    """
    axes = [axis.model_dump() for axis in req.axes]
    try:
        ndscan_params = await api.ndscan_builder.build_ndscan_params(
            file=req.file,
            class_name=req.class_name,
            axes=axes,
            fixed_params=req.fixed_params,
            num_repeats=req.num_repeats,
        )
    except ValueError as e:
        msg = str(e)
        if "not found" in msg:
            raise HTTPException(404, msg)
        raise HTTPException(422, msg)

    return api.models.ExpID(
        file=req.file,
        class_name=req.class_name,
        arguments={"ndscan_params": ndscan_params},
    )


@router.post("/scan")
async def submit_scan(
    req: api.models.ScanSubmitRequest,
    wait_for_completion: bool = False,
    timeout: float = 600.0,
) -> int | api.models.SubmitAndWaitResult:
    """Submit a high-level ndscan scan without constructing ndscan_params manually.

    The server builds canonical ndscan_params from *axes*, *fixed_params*, and
    *num_repeats* and submits the experiment through the standard scheduling
    path.

    Args:
        req: High-level scan submission request
        wait_for_completion: If True, block until the scan finishes before
            returning (default: False)
        timeout: Max seconds to wait when ``wait_for_completion`` is True
            (default: 600, max: 21600)

    Returns:
        The integer Run ID (RID) when ``wait_for_completion`` is False, or a
        SubmitAndWaitResult with *rid*, *status*, *timed_out*, and *error*
        fields when it is True.
    """
    if config.get("mock"):
        raise HTTPException(503, "Mock mode: experiment control not available")

    expid = await _build_scan_expid(req)
    await _validate_expid_ndscan(expid)
    try:
        rid = await api.control_schedule.submit_experiment(
            expid,
            req.pipeline,
            req.priority,
            req.flush,
            req.due_date,
        )
    except ValueError as e:
        raise HTTPException(422, str(e))

    if wait_for_completion:
        return await _wait_for_rid_completion(rid, min(timeout, 21600.0))
    return rid


app.include_router(router, prefix="/api")
app.include_router(sse.router, prefix="/api")
