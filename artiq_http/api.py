import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from . import artiq_api as api
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
    # Startup
    from . import artiq_api

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
    allow_credentials=True,
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
    schedule = await api.notifiers.get_schedule()

    if rid not in schedule:
        raise HTTPException(404, f"RID {rid} not found in schedule")

    return await api.control_schedule.cancel_experiment(rid, force)


@router.get("/explist")
async def get_explist() -> api.models.ExperimentList:
    return await api.notifiers.get_explist()


@router.get("/schedule/{rid}")
async def get_schedule_item(rid: int) -> api.models.ScheduleItem:
    schedule = await api.notifiers.get_schedule()
    if rid not in schedule:
        raise HTTPException(404, f"RID {rid} not found in schedule")
    return schedule[rid]


@router.get("/explist/search")
async def search_explist(q: str = "") -> api.models.ExperimentList:
    explist = await api.notifiers.get_explist()
    if not q:
        return explist
    q_lower = q.lower()
    filtered = [
        exp
        for exp in explist.experiments
        if q_lower in exp.name.lower()
        or q_lower in exp.file.lower()
        or q_lower in exp.class_name.lower()
    ]
    return api.models.ExperimentList(
        current_rev=explist.current_rev,
        scanning=explist.scanning,
        experiments=filtered,
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


@router.post("/schedule")
async def submit_experiment(
    expid: api.models.ExpID,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    due_date: float = None,
) -> None:
    try:
        return await api.control_schedule.submit_experiment(
            expid,
            pipeline,
            priority,
            flush,
            due_date,
        )
    except ValueError as e:
        raise HTTPException(422, str(e))


app.include_router(router, prefix="/api")

if config["dev_mode"]:
    print("Development mode")

    @app.get("/")
    async def index():
        return "HTML hosting is disabled in dev mode - access the react server from 'npm run frontend' directly"

else:
    print("Production mode")
    app.mount(
        "/",
        StaticFiles(directory=Path(__file__, "../static").resolve(), html=True),
        name="static",
    )
