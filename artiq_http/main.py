from typing import Dict
from typing import List

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import artiq_api as api
from . import patch_pydantic_numpy

app = FastAPI()

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


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/schedule")
async def get_schedule() -> Dict[int, api.models.ScheduleItem]:
    return await api.notifiers.get_schedule()


@app.get("/devices")
async def get_devices() -> dict:
    """Get the current device_db

    Returns:
        dict: ARTIQ Device_DB
    """
    return await api.notifiers.get_devices()


@app.get("/datasets")
async def get_datasets() -> dict:
    """Get all existing ARTIQ datasets

    This method might return a large output

    Returns:
        dict: All broadcasted ARTIQ datasets
    """
    return await api.notifiers.get_datasets()


@app.post("/cancel")
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


@app.get("/explist")
async def get_explist() -> api.models.ExperimentList:
    return await api.notifiers.get_explist()


@app.post("/schedule")
async def submit_experiment(
    expid: api.models.ExpID,
    pipeline: str = "main",
    priority: int = 0,
    flush: bool = False,
    due_date: float = None,
) -> None:
    return await api.control_schedule.submit_experiment(
        expid,
        pipeline,
        priority,
        flush,
        due_date,
    )
