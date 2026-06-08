"""Tests for artiq_http.artiq_api.ndscan_builder.

The builder emits the ndscan_params *argument value* — a PYON/JSON string in
ndscan's real decoded wire format (minimal {overrides, scan}). These tests
assert that wire format, because that is what ARTIQ's PYONValue processor and
ndscan's ArgumentInterface actually consume.
"""

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
async def test_build_ndscan_params_returns_pyon_string(mock_get_explist):
    """The builder returns the encoded string value, not the arginfo triple."""
    mock_get_explist.return_value = EXPLIST_WITH_NDSCAN

    result = await build_ndscan_params(
        file="ndscan_exp.py",
        class_name="NDScanExp",
        axes=[{"fqn": "test.frequency", "type": "linear", "range": {"start": 0.0, "stop": 100.0, "num_points": 10}}],
    )

    # A string that decodes to a dict — this is what ndscan's PYONValue
    # processor expects (a list/triple would raise TypeError in pyon.decode).
    assert isinstance(result, str)
    assert isinstance(json.loads(result), dict)


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_wire_format(mock_get_explist):
    """Overrides are wrapped, axes carry path + randomise_order, types are real."""
    mock_get_explist.return_value = EXPLIST_WITH_NDSCAN

    axes = [
        {
            "fqn": "test.frequency",
            "type": "linear",
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
    params = json.loads(result)

    # Minimal proven form: only overrides + scan are consumed by ndscan.
    assert set(params.keys()) == {"overrides", "scan"}

    # overrides: {fqn: [{"path": "", "value": v}]} — NOT a bare scalar.
    assert params["overrides"] == {"test.amplitude": [{"path": "", "value": 0.8}]}

    # scan.axes carry the required "path" and a defaulted randomise_order.
    axis = params["scan"]["axes"][0]
    assert axis["type"] == "linear"
    assert axis["fqn"] == "test.frequency"
    assert axis["path"] == ""
    assert axis["range"]["randomise_order"] is False
    assert axis["range"]["num_points"] == 10

    assert params["scan"]["num_repeats"] == 5
    assert params["scan"]["no_axes_mode"] == "single"
    assert params["scan"]["randomise_order_globally"] is False


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_centre_span(mock_get_explist):
    """centre_span axes pass centre/half_span through verbatim."""
    mock_get_explist.return_value = EXPLIST_WITH_NDSCAN

    result = await build_ndscan_params(
        file="ndscan_exp.py",
        class_name="NDScanExp",
        axes=[
            {
                "fqn": "test.frequency",
                "type": "centre_span",
                "range": {"centre": 0.0, "half_span": 16060.0, "num_points": 15},
            }
        ],
    )
    axis = json.loads(result)["scan"]["axes"][0]
    assert axis["type"] == "centre_span"
    assert axis["range"]["centre"] == 0.0
    assert axis["range"]["half_span"] == 16060.0
    assert axis["range"]["randomise_order"] is False


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_defaults(mock_get_explist):
    """Build ndscan_params with minimal arguments (defaults)."""
    mock_get_explist.return_value = EXPLIST_WITH_NDSCAN

    result = await build_ndscan_params(file="ndscan_exp.py", class_name="NDScanExp", axes=[])
    params = json.loads(result)
    assert params["overrides"] == {}
    assert params["scan"]["axes"] == []
    assert params["scan"]["num_repeats"] == 1


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_invalid_type(mock_get_explist):
    """An unknown generator name is rejected at build time."""
    mock_get_explist.return_value = EXPLIST_WITH_NDSCAN

    with pytest.raises(ValueError, match="invalid scan type"):
        await build_ndscan_params(
            file="ndscan_exp.py",
            class_name="NDScanExp",
            axes=[
                {"fqn": "test.frequency", "type": "LinearScan", "range": {"start": 0.0, "stop": 1.0, "num_points": 5}}
            ],
        )


@patch("artiq_http.artiq_api.ndscan_builder.get_explist", new_callable=AsyncMock)
async def test_build_ndscan_params_experiment_not_found(mock_get_explist):
    """ValueError when experiment is not in the explist."""
    mock_get_explist.return_value = EXPLIST_EMPTY

    with pytest.raises(ValueError, match="not found in explist"):
        await build_ndscan_params(file="missing.py", class_name="MissingExp", axes=[])


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
        await build_ndscan_params(file="simple.py", class_name="SimpleExp", axes=[])
