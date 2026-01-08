from typing import Dict

from ._get_dict import get_dict
from .models import ExperimentEntry
from .models import ExperimentList
from .models import ScheduleItem


async def get_schedule() -> Dict[int, ScheduleItem]:
    """Get the current state of the ARTIQ schedule

    Returns:
        dict: ARTIQ schedule
    """
    schedule_raw = await get_dict("schedule")

    return {k: ScheduleItem.model_validate(v) for k, v in schedule_raw.items()}


async def get_devices():
    """Get the current device_db

    Returns:
        dict: ARTIQ Device_DB
    """
    return await get_dict("devices")


async def get_datasets() -> dict:
    """Get all existing ARTIQ datasets

    This method might return a large output

    Returns:
        dict: All broadcasted ARTIQ datasets
    """
    return await get_dict("datasets")


async def get_explist() -> ExperimentList:
    explist_raw = await get_dict("explist")
    status = await get_dict("explist_status")

    experiment_list = []
    for name, data in explist_raw.items():
        data["name"] = name
        experiment_list.append(ExperimentEntry.model_validate(data))

    return ExperimentList(
        current_rev=status["cur_rev"],
        scanning=status["scanning"],
        experiments=experiment_list,
    )
