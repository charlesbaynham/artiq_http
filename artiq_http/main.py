from pathlib import Path
from typing import Dict

from fastapi import APIRouter
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import artiq_api as api
from . import patch_pydantic_numpy
from .config import config

app = FastAPI()

router = APIRouter()

origins = [
    "http://localhost",
    "http://localhost:5172",
    "http://localhost:5173",
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


@router.get("/datasets")
async def get_datasets() -> dict:
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


def main():
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
