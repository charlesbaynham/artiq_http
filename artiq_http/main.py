from typing import Dict
from typing import List

from fastapi import FastAPI
from fastapi import HTTPException

from . import artiq_api as api
from . import patch_pydantic_numpy


app = FastAPI()


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

    return api.control_schedule.cancel_experiment(rid, force)


@app.get("/explist")
async def get_explist() -> List[api.models.ExperimentEntry]:
    return await api.notifiers.get_explist()
