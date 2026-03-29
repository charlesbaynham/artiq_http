from typing import Any, Dict

from ._get_dict import get_dict
from .models import ExperimentEntry, ExperimentList, ScheduleItem


def _parse_ndscan_default_value(type_str: str, default_str: str) -> Any:
    """Parse a ndscan default value string according to its type.

    Args:
        type_str: The ndscan type (bool, float, int, etc.)
        default_str: The default value as a string

    Returns:
        The parsed value as the appropriate Python type
    """
    if type_str == "bool":
        return default_str.lower() == "true"
    elif type_str == "float":
        return float(default_str)
    elif type_str == "int":
        return int(default_str)
    elif type_str == "str":
        return default_str
    else:
        # For unknown types, return as string
        return default_str


def _extract_ndscan_defaults(arginfo: dict) -> Dict[str, Any]:
    """Extract default values from ndscan_params in arginfo.

    NDScan experiments store their parameters in a special 'ndscan_params' entry
    where the default value is a JSON string containing all parameter schemata.
    This function parses that JSON and extracts the default values.

    Args:
        arginfo: The experiment's arginfo dict, which may contain ndscan_params

    Returns:
        Dict mapping parameter names to their default values
    """
    import json

    ndscan_params = arginfo.get("ndscan_params")
    if not ndscan_params or not isinstance(ndscan_params, (list, tuple)):
        return {}

    try:
        # ndscan_params is [spec_dict, None, None] where spec_dict has "default" key
        spec = ndscan_params[0]
        if not isinstance(spec, dict):
            return {}

        default_json = spec.get("default")
        if not default_json or not isinstance(default_json, str):
            return {}

        params_data = json.loads(default_json)
        schemata = params_data.get("schemata", {})

        defaults = {}
        for fqn, schema in schemata.items():
            if not isinstance(schema, dict):
                continue

            # Use the last part of the FQN as the parameter name
            param_name = fqn.split(".")[-1]

            default_value = schema.get("default")
            if default_value is not None:
                type_str = schema.get("type", "str")
                defaults[param_name] = _parse_ndscan_default_value(type_str, default_value)

        return defaults
    except (json.JSONDecodeError, IndexError, KeyError, TypeError):
        # If anything goes wrong parsing ndscan_params, return empty dict
        return {}


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

    For ndscan experiments, also extracts defaults from the ndscan_params entry
    by parsing the JSON schemata.

    Args:
        arginfo: Mapping of argument name to [type_str, spec_dict, ...] as
            returned by the ARTIQ master experiment list.

    Returns:
        Dict mapping argument names to their default values. Arguments without
        a "default" key in their spec are not included.
    """
    defaults = {}

    # First, handle ndscan experiments
    if "ndscan_params" in arginfo:
        ndscan_defaults = _extract_ndscan_defaults(arginfo)
        defaults.update(ndscan_defaults)

    # Then, handle standard ARTIQ arginfo types
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
