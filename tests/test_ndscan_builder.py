"""Tests for artiq_http.artiq_api.ndscan_builder."""

import json
from unittest.mock import AsyncMock, patch

import pytest

from artiq_http.artiq_api.models import ExperimentEntry, ExperimentList
from artiq_http.artiq_api.ndscan_builder import build_ndscan_params

# ---------------------------------------------------------------------------
# Shared test data
# ---------------------------------------------------------------------------

NDSCAN_ARGINFO = {
    "ndscan_params": [
        {
            "ty": "PYONValue",
            "default": json.dumps(
                {
                    "instances": {"": ["test.frequency", "test.amplitude"]},
                    "schemata": {
                        "test.frequency": {
                            "fqn": "test.frequency",
                            "description": "Frequency",
                            "type": "float",
                            "default": "100.0",
                            "spec": {"is_scannable": True, "unit": "MHz"},
                        },
                        "test.amplitude": {
                            "fqn": "test.amplitude",
                            "description": "Amplitude",
                            "type": "float",
                            "default": "0.5",
                            "spec": {"is_scannable": True, "unit": "V"},
                        },
                    },
                    "always_shown": [],
                    "overrides": {},
                    "scan": {"axes": [], "num_repeats": 1},
                }
            ),
        },
        None,
        None,
    ]
}

NDSCAN_EXPERIMENT_ENTRY = {
    "name": "NDScan Experiment",
    "file": "ndscan_exp.py",
    "class_name": "NDScanExp",
    "arginfo": NDSCAN_ARGINFO,
    "argument_ui": None,
    "scheduler_defaults": {},
}

EXPLIST_WITH_NDSCAN = ExperimentList(
    current_rev="abc123",
    scanning=False,
    experiments=[ExperimentEntry(**NDSCAN_EXPERIMENT_ENTRY)],
)

EXPLIST_EMPTY = ExperimentList(
    current_rev="abc123",
    scanning=False,
    experiments=[],
)

# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_success(mock_get_explist):
    """Build ndscan_params with axes, overrides, and num_repeats."""
    mock_get_explist.return_value = EXPLIST_WITH_NDSCAN

    axes = [
        {
            "fqn": "test.frequency",
            "type": "LinearScan",
            "range": {"start": 0.0, "stop": 100.0, "num_points": 10},
        }
    ]
    fixed_params = {"test.amplitude": 0.8}

    result = await build_ndscan_params(
        file="ndscan_exp.py",
        class_name="NDScanExp",
        axes=axes,
        fixed_params=fixed_params,
        num_repeats=5,
    )

    # ARTIQ list-of-dicts wrapper
    assert isinstance(result, list)
    assert len(result) == 3
    assert result[0]["ty"] == "PYONValue"
    assert isinstance(result[0]["default"], str)
    assert result[1] is None
    assert result[2] is None

    # Parse the JSON payload
    params_data = json.loads(result[0]["default"])

    # Top-level keys
    assert set(params_data.keys()) == {
        "instances",
        "schemata",
        "always_shown",
        "overrides",
        "scan",
    }

    # instances preserved from original
    assert params_data["instances"] == {"": ["test.frequency", "test.amplitude"]}

    # schemata preserved from original
    assert "test.frequency" in params_data["schemata"]
    assert params_data["schemata"]["test.frequency"]["type"] == "float"

    # always_shown preserved from original
    assert params_data["always_shown"] == []

    # overrides = fixed_params
    assert params_data["overrides"] == {"test.amplitude": 0.8}

    # scan.axes and scan.num_repeats
    assert params_data["scan"]["axes"] == axes
    assert params_data["scan"]["num_repeats"] == 5


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_defaults(mock_get_explist):
    """Build ndscan_params with minimal arguments (defaults)."""
    mock_get_explist.return_value = EXPLIST_WITH_NDSCAN

    result = await build_ndscan_params(
        file="ndscan_exp.py",
        class_name="NDScanExp",
        axes=[],
    )

    params_data = json.loads(result[0]["default"])
    assert params_data["overrides"] == {}
    assert params_data["scan"]["axes"] == []
    assert params_data["scan"]["num_repeats"] == 1


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_experiment_not_found(mock_get_explist):
    """ValueError when experiment is not in the explist."""
    mock_get_explist.return_value = EXPLIST_EMPTY

    with pytest.raises(ValueError, match="not found in explist"):
        await build_ndscan_params(
            file="missing.py",
            class_name="MissingExp",
            axes=[],
        )


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_no_schemata(mock_get_explist):
    """ValueError when experiment has no ndscan schemata."""
    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[
            ExperimentEntry(
                name="Simple Exp",
                file="simple.py",
                class_name="SimpleExp",
                arginfo={"count": ["NumberValue", {"default": 10}, None, None]},
                argument_ui=None,
                scheduler_defaults={},
            )
        ],
    )

    with pytest.raises(ValueError, match="no ndscan schemata"):
        await build_ndscan_params(
            file="simple.py",
            class_name="SimpleExp",
            axes=[],
        )


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_preserves_always_shown(mock_get_explist):
    """always_shown from original ndscan_params is preserved."""
    arginfo_with_always_shown = {
        "ndscan_params": [
            {
                "ty": "PYONValue",
                "default": json.dumps(
                    {
                        "instances": {"": ["test.frequency"]},
                        "schemata": {
                            "test.frequency": {
                                "fqn": "test.frequency",
                                "type": "float",
                                "default": "100.0",
                                "spec": {"is_scannable": True},
                            }
                        },
                        "always_shown": [
                            {
                                "__jsonclass__": [
                                    "tuple",
                                    [["test.frequency", ""]],
                                ]
                            }
                        ],
                        "overrides": {},
                        "scan": {"axes": [], "num_repeats": 1},
                    }
                ),
            },
            None,
            None,
        ]
    }

    mock_get_explist.return_value = ExperimentList(
        current_rev="abc123",
        scanning=False,
        experiments=[
            ExperimentEntry(
                name="NDScan Exp",
                file="ndscan_exp.py",
                class_name="NDScanExp",
                arginfo=arginfo_with_always_shown,
                argument_ui=None,
                scheduler_defaults={},
            )
        ],
    )

    result = await build_ndscan_params(
        file="ndscan_exp.py",
        class_name="NDScanExp",
        axes=[],
    )

    params_data = json.loads(result[0]["default"])
    assert len(params_data["always_shown"]) == 1
    assert params_data["always_shown"][0]["__jsonclass__"][0] == "tuple"
