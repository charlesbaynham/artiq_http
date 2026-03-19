from typing import Dict

from ._get_dict import get_dict
from .models import ExperimentEntry, ExperimentList, ScheduleItem


async def get_schedule() -> Dict[int, ScheduleItem]:
    """Get the current state of the ARTIQ schedule from persistent subscriber

    This now uses a persistent subscriber that maintains the schedule in memory,
    eliminating the need to reconnect and re-download on every API call.

    Returns:
        dict: ARTIQ schedule

    Raises:
        HTTPException: 503 if ARTIQ master is not connected
    """
    from fastapi import HTTPException

    from .persistent_subscriber import subscriber_manager

    try:
        schedule_raw = subscriber_manager.get_schedule()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=f"ARTIQ master not available: {str(e)}")

    return {k: ScheduleItem.model_validate(v) for k, v in schedule_raw.items()}


async def get_devices():
    """Get the current device_db

    Returns:
        dict: ARTIQ Device_DB
    """
    return await get_dict("devices")


async def get_datasets() -> dict:
    """Get all existing ARTIQ datasets from persistent subscriber

    This now uses a persistent subscriber that maintains the datasets in memory,
    eliminating the need to reconnect and re-download on every API call.

    This method might return a large output

    Returns:
        dict: All broadcasted ARTIQ datasets

    Raises:
        HTTPException: 503 if ARTIQ master is not connected
    """
    from fastapi import HTTPException

    from .persistent_subscriber import subscriber_manager

    try:
        return subscriber_manager.get_datasets()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=f"ARTIQ master not available: {str(e)}")


async def get_explist() -> ExperimentList:
    """Get the current experiment list from persistent subscriber

    This now uses a persistent subscriber that maintains the explist in memory,
    eliminating the need to reconnect and re-download on every API call.

    Raises:
        HTTPException: 503 if ARTIQ master is not connected
    """
    from fastapi import HTTPException

    from .persistent_subscriber import subscriber_manager

    try:
        explist_raw = subscriber_manager.get_explist()
        status = subscriber_manager.get_explist_status()
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=f"ARTIQ master not available: {str(e)}")

    experiment_list = []
    for name, data in explist_raw.items():
        data["name"] = name
        experiment_list.append(ExperimentEntry.model_validate(data))

    return ExperimentList(
        current_rev=status.get("cur_rev", "unknown"),
        scanning=status.get("scanning", False),
        experiments=experiment_list,
    )
