from typing import Any, Dict

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


def extract_arginfo_defaults(arginfo: dict) -> Dict[str, Any]:
    """Extract default values from an ARTIQ arginfo dict.

    Iterates over the arginfo mapping and returns a dict of argument names to
    their default values. Only arguments whose type is one of the known ARTIQ
    types (NumberValue, StringValue, BooleanValue, EnumerationValue, Scannable)
    are considered. Arguments whose spec dict does not contain a "default" key
    are omitted from the result entirely, so callers can distinguish "no default
    exists" from "default is None". Unknown types are silently skipped.

    Args:
        arginfo: Mapping of argument name to [type_str, spec_dict, ...] as
            returned by the ARTIQ master experiment list.

    Returns:
        Dict mapping argument names to their default values. Arguments without
        a "default" key in their spec are not included.
    """
    defaults = {}
    for arg_name, arg_data in arginfo.items():
        if not isinstance(arg_data, (list, tuple)) or len(arg_data) < 2:
            continue
        type_str = arg_data[0]
        spec_dict = arg_data[1]
        if not isinstance(spec_dict, dict):
            continue
        if type_str in ("NumberValue", "StringValue", "BooleanValue", "EnumerationValue", "Scannable"):
            if "default" in spec_dict:
                defaults[arg_name] = spec_dict["default"]
    return defaults


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
