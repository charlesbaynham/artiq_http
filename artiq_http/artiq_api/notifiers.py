from ._get_dict import get_dict
from .models import ScheduleItem


async def get_schedule():
    """Get the current state of the ARTIQ schedule

    Returns:
        dict: ARTIQ schedule
    """
    schedule_raw = await get_dict("schedule")

    return {k: ScheduleItem.parse_obj(v) for k, v in schedule_raw.items()}


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
