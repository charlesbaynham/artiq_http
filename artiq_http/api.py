from pathlib import Path
from typing import Any, Dict

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.encoders import ENCODERS_BY_TYPE
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from . import artiq_api as api
from .config import config


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


app = FastAPI(default_response_class=NumpyJSONResponse)

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
