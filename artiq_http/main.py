from typing import Dict

from fastapi import FastAPI

from . import patch_pydantic_numpy
from .artiq_api import notifiers
from .artiq_api.models import ScheduleItem

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/schedule")
async def get_schedule() -> Dict[int, ScheduleItem]:
    return await notifiers.get_schedule()


@app.get("/devices")
async def get_devices() -> dict:
    """Get the current device_db

    Returns:
        dict: ARTIQ Device_DB
    """
    return await notifiers.get_devices()


@app.get("/datasets")
async def get_datasets() -> dict:
    """Get all existing ARTIQ datasets

    This method might return a large output

    Returns:
        dict: All broadcasted ARTIQ datasets
    """
    return await notifiers.get_datasets()


# @app.post("/cancel")
# async def cancel_experiment(rid:int, force:bool=False) -> None:
#     """Cancel a running experiment

#     Args:
#         rid (int): RID of the experiment to cancel
#         force (bool): If True, forcibly close the experiment instead of requesting closure
#     """
#     datasets = await

#     return control_schedule.cancel_experiment(SERVER, rid, force)
