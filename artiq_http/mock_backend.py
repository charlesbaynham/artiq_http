"""
Mock backend for frontend development.

Replaces the real SubscriberManager with a mock that serves plausible fake
data without requiring a running ARTIQ master.  Activated via --mock or
ARTIQ_HTTP_MOCK=1.

Serves one 0D repeat single-point NDScan (ndscan.rid_1) with four channels
whose values drift sinusoidally with Gaussian noise, updating every 0.5 s.

Also serves two 1D frequency-scan NDScans of the same experiment
(mock.MockFreqScan): a completed run (ndscan.rid_4821) usable as a ghost
overlay, and a live run (ndscan.rid_4823) whose points stream in a
*randomized* order with repeats at each x. The randomized order with repeats
exercises the Plot1D line rendering, which sorts points by x and draws the
line through the per-x mean with standard-error-of-the-mean error bars.

The explist also includes MockRabiFlop, a large (214-parameter) ndscan
experiment with a realistically nested fragment tree, and the mock schedule
starts pre-populated with a running RID (4823, RabiFlop) and a pending RID
(4824, CalibrateTrapFreq) so the queue/live UI has content immediately.
Submitting (POST /api/schedule or /api/scan) and cancelling (POST
/api/cancel) work against this in-memory mock schedule — RIDs are allocated
from a counter starting at 4825.
"""

import asyncio
import itertools
import json
import logging
import math
import random
import time
from typing import Any, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)

_RID = 1
_PREFIX = f"ndscan.rid_{_RID}"

# `display_hints.priority` mirrors ndscan: higher means more important, negative
# means hidden by default. Signal A/B are the "important" channels the experiment
# shows by default; Signal C/D are diagnostics hidden until the user enables them.
_CHANNELS = {
    "ch0": {
        "path": "ch0",
        "description": "Signal A",
        "type": "float",
        "scale": 1.0,
        "unit": "",
        "display_hints": {"priority": 1},
    },
    "ch1": {
        "path": "ch1",
        "description": "Signal B",
        "type": "float",
        "scale": 1.0,
        "unit": "",
        "display_hints": {"priority": 1},
    },
    "ch2": {
        "path": "ch2",
        "description": "Signal C",
        "type": "float",
        "scale": 1.0,
        "unit": "",
        "display_hints": {"priority": -1},
    },
    "ch3": {
        "path": "ch3",
        "description": "Signal D",
        "type": "float",
        "scale": 1.0,
        "unit": "",
        "display_hints": {"priority": -1},
    },
}

_STATIC_DATASETS: Dict[str, Any] = {
    f"{_PREFIX}.axes": [False, "[]", {}],
    f"{_PREFIX}.channels": [False, json.dumps(_CHANNELS), {}],
    f"{_PREFIX}.fragment_fqn": [False, "mock.MockRepeatExperiment", {}],
    f"{_PREFIX}.completed": [False, False, {}],
}


# ── Plain (non-ndscan) arginfo for MockRepeatExperiment / MockFreqScan ───────
# ARTIQ's real arginfo shape is {arg_name: [type_str, spec_dict, group, tooltip]}
# (see notifiers.extract_arginfo_defaults and tests/test_agent_endpoints.py's
# ARGINFO fixture) — a handful of small, non-empty entries here exercises the
# non-ndscan submit path (plain NumberValue/BooleanValue/StringValue/
# EnumerationValue args) that used to be untestable against the mock backend.
_REPEAT_EXPERIMENT_ARGINFO: Dict[str, Any] = {
    "repeat_count": [
        "NumberValue",
        {"default": 100, "unit": "", "scale": 1, "step": 1, "min": 1, "max": None, "ndecimals": 0},
        "Repeat",
        "Number of repeat measurements to take",
    ],
    "enable_averaging": [
        "BooleanValue",
        {"default": True},
        "Repeat",
        "Average the signal over the repeat window before recording it",
    ],
    "notes": [
        "StringValue",
        {"default": "mock run"},
        "Repeat",
        "Free-form notes recorded alongside the run",
    ],
}

_FREQ_SCAN_ARGINFO: Dict[str, Any] = {
    "center_frequency": [
        "NumberValue",
        {"default": 0.0, "unit": "MHz", "scale": 1e6, "step": 1e5, "min": -50e6, "max": 50e6, "ndecimals": 3},
        "Scan",
        "Center of the manual frequency sweep",
    ],
    "averaging_mode": [
        "EnumerationValue",
        {"choices": ["fast", "precise"], "default": "fast"},
        "Scan",
        "Averaging strategy used at each point",
    ],
    "camera_enabled": [
        "BooleanValue",
        {"default": False},
        "Diagnostics",
        "Enable auxiliary camera capture during the scan",
    ],
}


# ── MockRabiFlop: a large, realistically-nested ndscan experiment ───────────
#
# The mock previously returned arginfo: {} for every experiment, which made
# the new submit UI (fragment tree, working set, scan axes) impossible to
# develop or screenshot against. RabiFlop is a synthetic ndscan experiment
# whose 214-parameter schema is generated programmatically below (with a
# handful of parameters hand-written so their wording/units match the design
# exactly), in ndscan's real wire format — see FloatParam/IntParam/BoolParam/
# StringParam/EnumParam.describe() in
# .agents/deps/ndscan/ndscan/experiment/parameters.py, which this mirrors:
# {"fqn", "description", "type", "default" (always a STRING), "spec"
# ({"is_scannable", "scale", "step", "min", "max", "unit"} for numeric types),
# "explanation"}.

# kind -> (python type name, unit, scale, is_scannable, one-sentence description template).
# Defaults are expressed in raw (unscaled) units, exactly as real ndscan stores
# them; the UI is expected to divide by `scale` to display them in `unit`.
_KIND_SPECS: Dict[str, tuple] = {
    "freq": ("float", "MHz", 1e6, True, "Frequency of the {ctx}"),
    "detuning": ("float", "MHz", 1e6, True, "Detuning of the {ctx} from resonance"),
    "power": ("float", "mW", 1e-3, True, "Optical power delivered to the {ctx}"),
    "duration": ("float", "us", 1e-6, True, "Duration of the {ctx} pulse"),
    "amplitude": ("float", "", 1.0, True, "Amplitude of the {ctx} drive, in units of full scale"),
    "current": ("float", "mA", 1e-3, True, "Current supplied to the {ctx}"),
    "voltage": ("float", "V", 1.0, True, "Voltage applied to the {ctx}"),
    "gain": ("float", "", 1.0, True, "Feedback gain for the {ctx} servo loop"),
    "delay": ("float", "us", 1e-6, True, "Timing delay inserted before the {ctx} step"),
    "phase": ("float", "", 1.0, True, "Phase offset applied to the {ctx}"),
    "offset": ("float", "", 1.0, True, "Constant offset added to the {ctx} setpoint"),
    "rate": ("float", "", 1.0, True, "Rate of change applied to the {ctx}"),
    "attenuation": ("float", "dB", 1.0, True, "Attenuation applied to the {ctx}"),
    "temperature": ("float", "", 1.0, True, "Target temperature associated with the {ctx}"),
    "threshold": ("int", "", 1, False, "Threshold used to discriminate the {ctx}"),
    "count": ("int", "", 1, False, "Number of repeats used for the {ctx}"),
    "flag": ("bool", "", 1, False, "Enables the {ctx}"),
    "mode": ("enum", "", 1, False, "Operating mode selected for the {ctx}"),
    "label": ("string", "", 1, False, "Identifying label recorded for the {ctx}"),
}

_ENUM_MEMBER_SETS: List[Dict[str, str]] = [
    {"FAST": "fast", "PRECISE": "precise", "SAFE": "safe"},
    {"LOW": "low", "MEDIUM": "medium", "HIGH": "high"},
    {"AUTO": "auto", "MANUAL": "manual"},
]

_COMPONENT_WORDS = [
    "beam",
    "aom",
    "eom",
    "shutter",
    "lock",
    "coil",
    "electrode",
    "channel",
    "servo",
    "sensor",
    "cavity",
    "grating",
    "mirror",
    "photodiode",
    "trigger",
    "gate",
    "window",
    "reference",
    "loop",
    "stage",
]

# Group name -> (total leaf count, subgroup names). A group with no subgroups
# has all its leaves directly at depth 2 (group.leaf); a group with subgroups
# gets a mix of depth-2 and depth-3 (group.subgroup.leaf) leaves, so the
# resulting fragment tree is genuinely nested at both depths. Total leaves
# across all groups (including the hand-written ones below) is exactly 214.
_RABI_FLOP_GROUPS: Dict[str, tuple] = {
    "cooling": (18, ["doppler", "sideband", "repump", "mot"]),
    "eit": (11, ["pump", "probe", "two_photon"]),
    "rabi": (6, []),
    "readout": (9, ["camera", "pmt"]),
    "trap": (14, ["rf", "dc", "compensation"]),
    "laser": (30, ["repump_laser", "cooling_laser", "raman", "clock"]),
    "magnet": (20, ["bias", "gradient", "shim"]),
    "dds": (25, ["channel_a", "channel_b", "channel_c"]),
    "ion": (25, ["loading", "chain", "micromotion"]),
    "sequence": (25, ["timing", "triggers", "gating"]),
    "calibration": (31, ["frequency", "power", "alignment", "drift"]),
}


def _kind_schema(kind: str, ctx: str, seed: int) -> Dict[str, Any]:
    """Build a schema body (everything describe() returns except 'fqn') for one
    leaf of the given *kind*, with a deterministic-but-varied default value."""
    ty, unit, scale, scannable, template = _KIND_SPECS[kind]
    description = template.format(ctx=ctx)

    if ty == "float":
        display_value = 1.0 + (seed % 7) * 0.5
        default_raw = display_value * scale if scale else display_value
        spec: Dict[str, Any] = {"is_scannable": scannable, "scale": scale, "step": (scale or 1.0) / 10.0}
        if unit:
            spec["unit"] = unit
        return {
            "description": description,
            "type": "float",
            "default": str(default_raw),
            "spec": spec,
            "explanation": "",
        }

    if ty == "int":
        default = 1 + (seed % 20)
        return {
            "description": description,
            "type": "int",
            "default": str(default),
            "spec": {"is_scannable": scannable, "scale": 1},
            "explanation": "",
        }

    if ty == "bool":
        default = seed % 2 == 0
        return {
            "description": description,
            "type": "bool",
            "default": str(default),
            "spec": {"is_scannable": scannable},
            "explanation": "",
        }

    if ty == "string":
        default_word = ctx.split()[0] if ctx.split() else "default"
        return {
            "description": description,
            "type": "string",
            "default": repr(default_word),
            "spec": {"is_scannable": scannable},
            "explanation": "",
        }

    # enum
    members = _ENUM_MEMBER_SETS[seed % len(_ENUM_MEMBER_SETS)]
    default_name = next(iter(members))
    return {
        "description": description,
        "type": "enum",
        "default": repr(default_name),
        "spec": {"members": members, "is_scannable": scannable},
        "explanation": "",
    }


def _hand_written_rabi_flop_params() -> Dict[str, Dict[str, Any]]:
    """The handful of parameters whose wording/units are specified by the design,
    keyed by FQN (schema body only, 'fqn' added by the caller)."""
    return {
        "cooling.doppler.freq": {
            "description": "Doppler cooling beam detuning from resonance",
            "type": "float",
            "default": "3000000.0",
            "spec": {"is_scannable": True, "scale": 1e6, "step": 1e5, "unit": "MHz"},
            "explanation": "",
        },
        "cooling.doppler.blue_beam_power": {
            "description": "Optical power in the 397 nm cooling beam",
            "type": "float",
            "default": "1.2",
            "spec": {"is_scannable": True, "scale": 1.0, "step": 0.05},
            "explanation": "",
        },
        "rabi.pulse_duration": {
            "description": "Length of the driving pulse on the qubit transition",
            "type": "float",
            "default": "3e-05",
            "spec": {"is_scannable": True, "scale": 1e-6, "step": 1e-7, "unit": "us"},
            "explanation": "",
        },
        "rabi.detuning": {
            "description": "Frequency offset of the drive from the carrier",
            "type": "float",
            "default": "0.0",
            "spec": {"is_scannable": True, "scale": 1e6, "step": 1e4, "unit": "MHz"},
            "explanation": "",
        },
        "rabi.n_repeats": {
            "description": "Shots averaged at every point of the scan",
            "type": "int",
            "default": "50",
            "spec": {"is_scannable": False, "scale": 1},
            "explanation": "",
        },
        "readout.threshold": {
            "description": "Photon count above which the ion is called bright",
            "type": "int",
            "default": "14",
            "spec": {"is_scannable": False, "scale": 1},
            "explanation": "",
        },
    }


def _build_rabi_flop_schemata() -> tuple[Dict[str, Dict[str, Any]], Dict[str, List[str]], List[List[str]]]:
    """Generate RabiFlop's full ndscan schema: 214 leaves across the groups in
    _RABI_FLOP_GROUPS (18+11+6+9+14+30+20+25+25+25+31), a handful of which are
    hand-written above so their wording matches the design exactly.

    Returns (schemata, instances, always_shown) in ndscan's wire shapes:
    schemata is {fqn: schema}; instances is {path: [fqn, ...]} (everything
    lives on the top-level fragment, path ""); always_shown is a list of
    [fqn, path] pairs (ndscan PYON-encodes these as tuples, but a plain list
    round-trips through JSON and the frontend's parser tolerates both forms).
    """
    schemata: Dict[str, Dict[str, Any]] = {}
    instances: Dict[str, List[str]] = {"": []}

    def add(fqn: str, body: Dict[str, Any]) -> None:
        schemata[fqn] = {"fqn": fqn, **body}
        instances[""].append(fqn)

    for fqn, body in _hand_written_rabi_flop_params().items():
        add(fqn, body)

    always_shown = [
        [fqn, ""] for fqn in ("cooling.doppler.freq", "rabi.pulse_duration", "rabi.detuning", "readout.threshold")
    ]

    kind_cycle = itertools.cycle(_KIND_SPECS.keys())
    seed = 0
    for group, (total, subgroups) in _RABI_FLOP_GROUPS.items():
        existing = sum(1 for fqn in schemata if fqn.split(".", 1)[0] == group)
        remaining = total - existing
        n_direct = remaining if not subgroups else min(remaining, max(0, round(remaining * 0.3)))
        buckets: List[Optional[str]] = [None] * n_direct + list(
            itertools.islice(itertools.cycle(subgroups or [None]), remaining - n_direct)
        )

        component_cycle = itertools.cycle(_COMPONENT_WORDS)
        name_counts: Dict[tuple, int] = {}
        for bucket in buckets:
            kind = next(kind_cycle)
            component = next(component_cycle)
            key = (bucket, component, kind)
            name_counts[key] = name_counts.get(key, 0) + 1
            n = name_counts[key]
            leaf = f"{component}_{kind}" if n == 1 else f"{component}_{kind}_{n}"
            fqn = f"{group}.{bucket}.{leaf}" if bucket else f"{group}.{leaf}"
            while fqn in schemata:  # pragma: no cover - defensive, not expected to trigger
                seed += 1
                leaf = f"{leaf}_{seed}"
                fqn = f"{group}.{bucket}.{leaf}" if bucket else f"{group}.{leaf}"

            ctx = f"{group} {bucket} {component}" if bucket else f"{group} {component}"
            add(fqn, _kind_schema(kind, ctx, seed))
            seed += 1

    instances = {path: fqns for path, fqns in instances.items() if fqns}
    return schemata, instances, always_shown


def _build_rabi_flop_arginfo() -> Dict[str, Any]:
    """Build MockRabiFlop's full arginfo: a single ndscan_params PYONValue whose
    default decodes to {instances, schemata, always_shown, overrides, scan} in
    ndscan's real format (see ArgumentInterface.build in
    .agents/deps/ndscan/ndscan/experiment/entry_point.py)."""
    schemata, instances, always_shown = _build_rabi_flop_schemata()
    params_default = {
        "instances": instances,
        "schemata": schemata,
        "always_shown": always_shown,
        "overrides": {},
        "scan": {"axes": [], "num_repeats": 1, "no_axes_mode": "single", "randomise_order_globally": False},
    }
    return {
        "ndscan_params": [
            {"ty": "PYONValue", "default": json.dumps(params_default)},
            None,
            None,
        ]
    }


_RABI_FLOP_ARGINFO = _build_rabi_flop_arginfo()
_RABI_FLOP_PARAM_COUNT = len(json.loads(_RABI_FLOP_ARGINFO["ndscan_params"][0]["default"])["schemata"])
assert _RABI_FLOP_PARAM_COUNT == 214, f"expected 214 RabiFlop params, got {_RABI_FLOP_PARAM_COUNT}"

_RABI_FLOP_FILE = "Spectroscopy/rabi_flop.py"
_RABI_FLOP_CLASS = "RabiFlop"

# The ndscan_params *value* (not the arginfo descriptor) for the running
# schedule item RID 4823: a single linear axis on rabi.pulse_duration with 101
# points, so the frontend's progress derivation (state/useLiveRun.js
# runProgress()) reads a real "N/101" from expid.arguments.ndscan_params
# instead of a hardcoded string.
_RID_4823_NDSCAN_PARAMS = json.dumps(
    {
        "overrides": {},
        "scan": {
            "axes": [
                {
                    "type": "linear",
                    "range": {"start": 1e-6, "stop": 5e-5, "num_points": 101, "randomise_order": False},
                    "fqn": "rabi.pulse_duration",
                    "path": "",
                }
            ],
            "num_repeats": 1,
            "no_axes_mode": "single",
            "randomise_order_globally": False,
        },
    }
)

# The mock schedule starts pre-populated so the queue panel and live-status bar
# have content immediately: RID 4823 is a running RabiFlop scan (101-point
# pulse-duration sweep), RID 4824 is a pending CalibrateTrapFreq experiment
# (not itself in the explist — it's just a plausible queued neighbour).
_SCHEDULE_SEED: Dict[int, Dict[str, Any]] = {
    4823: {
        "pipeline": "main",
        "priority": 0,
        "due_date": None,
        "flush": False,
        "status": "running",
        "repo_msg": None,
        "expid": {
            "log_level": 30,
            "file": _RABI_FLOP_FILE,
            "class_name": _RABI_FLOP_CLASS,
            "arguments": {"ndscan_params": _RID_4823_NDSCAN_PARAMS},
            "repo_rev": None,
        },
    },
    4824: {
        "pipeline": "main",
        "priority": 0,
        "due_date": None,
        "flush": False,
        "status": "pending",
        "repo_msg": None,
        "expid": {
            "log_level": 30,
            "file": "Calibration/calibrate_trap_freq.py",
            "class_name": "CalibrateTrapFreq",
            "arguments": {},
            "repo_rev": None,
        },
    },
}
_FIRST_ALLOCATED_RID = 4825


_MOCK_EXPLIST = {
    "MockRepeatExperiment": {
        "file": "mock_experiment.py",
        "class_name": "MockRepeatExperiment",
        "arginfo": _REPEAT_EXPERIMENT_ARGINFO,
        "argument_ui": None,
        "scheduler_defaults": {},
        "docstring": "Mock repeat experiment for frontend development",
    },
    "MockFreqScan": {
        "file": "mock_experiment.py",
        "class_name": "MockFreqScan",
        "arginfo": _FREQ_SCAN_ARGINFO,
        "argument_ui": None,
        "scheduler_defaults": {},
        "docstring": "Mock 1D frequency scan for frontend development",
    },
    _RABI_FLOP_CLASS: {
        "file": _RABI_FLOP_FILE,
        "class_name": _RABI_FLOP_CLASS,
        "arginfo": _RABI_FLOP_ARGINFO,
        "argument_ui": None,
        "scheduler_defaults": {},
        "docstring": "Mock Rabi flopping experiment (ndscan) with a large, realistically nested fragment tree",
    },
}


# ── 1D frequency-scan mocks ──────────────────────────────────────────────────
# Two runs of the same experiment so the timeline can offer one as a ghost
# overlay of the other. rid_4823 is live and reveals its points in randomized
# order with repeats; rid_4821 is a completed run with a shifted resonance.
_SCAN1D_FQN = "mock.MockFreqScan"
# Renumbered to match the mock schedule: the live run's RID (4823) matches the
# running RabiFlop schedule item, so the frontend can find its live data by
# extracting the RID from the schedule and looking up the matching dataset
# prefix. The ghost run (4821) just needs to be distinct from it.
_SCAN1D_GHOST_PREFIX = "ndscan.rid_4821"
_SCAN1D_LIVE_PREFIX = "ndscan.rid_4823"

# `signal` (small scale, the important channel) plus a large-scale (~10⁴–10⁵)
# `atom_number`: their unrelated scales make the frontend's scale-based fallback
# group `atom_number` onto its own plot, exercising the fix for crushed shared
# y-axes. `reference` is a negative-priority diagnostic, hidden by default so the
# plot opens on `signal`/`atom_number` until the user enables it.
_SCAN1D_CHANNELS = {
    "signal": {"path": "signal", "description": "Excitation", "type": "float", "scale": 1.0, "unit": ""},
    "reference": {
        "path": "reference",
        "description": "Reference",
        "type": "float",
        "scale": 1.0,
        "unit": "",
        "display_hints": {"priority": -1},
    },
    "atom_number": {"path": "atom_number", "description": "Atom number", "type": "float", "scale": 1.0, "unit": ""},
}

# One scanned axis: detuning in MHz. Mirrors the schema ndscan writes to the
# `.axes` dataset (see ndscan's test_experiment_entrypoint fixtures).
_SCAN1D_AXIS = {
    "increment": 5.0,
    "max": 25.0,
    "min": -25.0,
    "path": "*",
    "param": {
        "default": "0.0",
        "description": "Detuning",
        "fqn": _SCAN1D_FQN + ".detuning",
        "unit": "MHz",
        "type": "float",
        "spec": {"is_scannable": True, "scale": 1.0, "step": 1.0},
    },
}

# 11 distinct x points, each measured _SCAN1D_REPEATS times.
_SCAN1D_X_POINTS = [-25.0 + 5.0 * i for i in range(11)]
_SCAN1D_REPEATS = 4


def _scan1d_sample(x: float, center: float) -> Dict[str, float]:
    """A noisy Lorentzian resonance in `signal`, a flat-ish `reference`, and a
    large-scale `atom_number` (~10⁴–10⁵) that tracks the resonance."""
    width = 6.0
    lorentzian = 1.0 / (1.0 + ((x - center) / width) ** 2)
    signal = 0.12 + 0.8 * lorentzian + random.gauss(0, 0.05)
    reference = 0.5 + random.gauss(0, 0.03)
    atom_number = 50000.0 + 30000.0 * lorentzian + random.gauss(0, 3000.0)
    return {"signal": signal, "reference": reference, "atom_number": atom_number}


def _scan1d_schedule() -> List[float]:
    """A randomized measurement order: each x point repeated _SCAN1D_REPEATS times."""
    plan = [x for x in _SCAN1D_X_POINTS for _ in range(_SCAN1D_REPEATS)]
    random.shuffle(plan)
    return plan


def _scan1d_static(prefix: str, completed: bool) -> Dict[str, Any]:
    """Static (metadata) datasets shared by both 1D runs."""
    return {
        f"{prefix}.axes": [False, json.dumps([_SCAN1D_AXIS]), {}],
        f"{prefix}.channels": [False, json.dumps(_SCAN1D_CHANNELS), {}],
        f"{prefix}.fragment_fqn": [False, _SCAN1D_FQN, {}],
        f"{prefix}.completed": [False, completed, {}],
    }


_IMAGE_SIZE = 64

# Several mock camera images with distinct sizes and patterns so the Plots
# image view can be exercised with multiple images at once.
_IMAGE_SPECS = [
    {"key": "camera_image", "size": 64, "kind": "blob"},
    {"key": "mot_fluorescence_image", "size": 64, "kind": "blob"},
    {"key": "ion_chain_image", "size": 96, "kind": "chain"},
    {"key": "background_image", "size": 48, "kind": "noise"},
    {"key": "absorption_image", "size": 80, "kind": "rings"},
]
_IMAGE_KEY = _IMAGE_SPECS[0]["key"]


def _to_artiq_order(rows: list) -> list:
    """Transpose a row-major (``[y][x]``) image into ARTIQ's col-major order.

    Real ARTIQ image datasets are stored in pyqtgraph's convention where the
    first array axis is x (horizontal) and the second is y (vertical). The
    frontend renders with that same convention, so the mock emits transposed
    arrays to stay faithful to real data.
    """
    return [list(col) for col in zip(*rows)]


def _generate_image(size: int = _IMAGE_SIZE, kind: str = "blob", seed: float = 0.0) -> list:
    """Generate a `size`×`size` grayscale image with a time-varying pattern.

    Returned in ARTIQ's col-major ``[x][y]`` order (see `_to_artiq_order`).
    """
    t = time.time() + seed
    rows = []
    if kind == "chain":
        # A horizontal row of evenly spaced bright spots (mock ion chain).
        n_ions = 5
        cy = size / 2 + 3 * math.sin(t * 0.4)
        sigma = 4.0
        centres = [size * (i + 1) / (n_ions + 1) for i in range(n_ions)]
        for row in range(size):
            r = []
            for col in range(size):
                v = 0.0
                for cx in centres:
                    v += 200 * math.exp(-((row - cy) ** 2 + (col - cx) ** 2) / (2 * sigma**2))
                v += random.gauss(0, 3)
                r.append(max(0, min(255, int(v))))
            rows.append(r)
        return _to_artiq_order(rows)
    if kind == "rings":
        # Concentric rings (mock absorption image).
        cx = cy = size / 2
        for row in range(size):
            r = []
            for col in range(size):
                rad = math.hypot(row - cy, col - cx)
                v = 128 + 100 * math.cos(rad * 0.8 - t * 1.5)
                v += random.gauss(0, 5)
                r.append(max(0, min(255, int(v))))
            rows.append(r)
        return _to_artiq_order(rows)
    if kind == "noise":
        # Mostly background noise with a faint drift (mock dark frame).
        base = 30 + 10 * math.sin(t * 0.2)
        for _row in range(size):
            r = []
            for _col in range(size):
                r.append(max(0, min(255, int(base + random.gauss(0, 8)))))
            rows.append(r)
        return _to_artiq_order(rows)
    # Default: a drifting Gaussian blob.
    cx = size / 2 + (size * 0.3) * math.sin(t * 0.3)
    cy = size / 2 + (size * 0.3) * math.cos(t * 0.2)
    sigma = size / 8 + (size / 16) * math.sin(t * 0.15)
    for row in range(size):
        r = []
        for col in range(size):
            v = 220 * math.exp(-((row - cy) ** 2 + (col - cx) ** 2) / (2 * sigma**2))
            v += random.gauss(0, 4)
            r.append(max(0, min(255, int(v))))
        rows.append(r)
    return _to_artiq_order(rows)


def _generate_point_values() -> Dict[str, float]:
    t = time.time()
    return {
        "ch0": 0.5 + 0.3 * math.sin(t * 0.5) + random.gauss(0, 0.05),
        "ch1": 0.3 + 0.2 * math.sin(t * 0.7 + 1.0) + random.gauss(0, 0.04),
        "ch2": 0.7 + 0.15 * math.sin(t * 0.3 + 2.0) + random.gauss(0, 0.03),
        "ch3": 0.1 + 0.4 * math.sin(t * 0.4 + 3.0) + random.gauss(0, 0.06),
    }


class _AlwaysConnected:
    """Minimal stub satisfying the is_connected() protocol."""

    def is_connected(self) -> bool:
        return True

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        return True

    async def start(self):
        pass

    async def stop(self):
        pass


class MockDatasetsSubscriber:
    """Drop-in for PersistentSubscriber, used for the datasets channel."""

    def __init__(self):
        self._data: Dict[str, Any] = {}
        self._callbacks: List[Callable[[Dict], None]] = []

    def is_connected(self) -> bool:
        return True

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        return True

    async def start(self):
        pass

    async def stop(self):
        pass

    def get_data(self) -> Dict[str, Any]:
        return dict(self._data)

    def register_change_callback(self, callback: Callable[[Dict], None]) -> None:
        if callback not in self._callbacks:
            self._callbacks.append(callback)

    def unregister_change_callback(self, callback: Callable[[Dict], None]) -> None:
        if callback in self._callbacks:
            self._callbacks.remove(callback)

    def _set_and_notify(self, key: str, value: Any) -> None:
        self._data[key] = value
        mod = {"action": "setitem", "key": key, "path": []}
        for cb in list(self._callbacks):
            try:
                cb(mod)
            except Exception:
                logger.exception("Error in mock dataset callback")


class MockSubscriberManager:
    """Drop-in replacement for SubscriberManager used in mock mode."""

    def __init__(self):
        self._datasets_sub = MockDatasetsSubscriber()
        self._subscribers = {
            "explist": _AlwaysConnected(),
            "explist_status": _AlwaysConnected(),
            "schedule": _AlwaysConnected(),
            "datasets": self._datasets_sub,
            "logs": _AlwaysConnected(),
        }
        self._task: asyncio.Task | None = None
        self._started = False
        # Live 1D scan progress (rid_4823): a randomized measurement schedule that
        # is revealed one point per tick and reshuffled once exhausted.
        self._scan1d_schedule: List[float] = []
        self._scan1d_idx = 0
        self._scan1d_center = 0.0
        # In-memory mock schedule (RID -> ScheduleItem-shaped dict), seeded with
        # a running and a pending item; submit()/cancel() mutate this directly so
        # the submit -> queue -> live flow is exercisable without a real master.
        self._schedule: Dict[int, Dict[str, Any]] = {}
        self._next_rid = _FIRST_ALLOCATED_RID

    async def start(self) -> None:
        if self._started:
            return
        # Seed static datasets
        self._datasets_sub._data.update(_STATIC_DATASETS)
        # Seed initial point values
        for ch, val in _generate_point_values().items():
            self._datasets_sub._data[f"{_PREFIX}.point.{ch}"] = [False, val, {}]
        # Seed initial images
        for i, spec in enumerate(_IMAGE_SPECS):
            self._datasets_sub._data[spec["key"]] = [
                False,
                _generate_image(spec["size"], spec["kind"], seed=i * 1.7),
                {},
            ]

        # Seed the mock schedule (RID 4823 running, RID 4824 pending).
        self._schedule = {rid: dict(item) for rid, item in _SCHEDULE_SEED.items()}
        self._next_rid = _FIRST_ALLOCATED_RID

        # Seed the completed 1D ghost run (rid_4821): a full sweep with a shifted
        # resonance so it visibly differs from the live run.
        self._datasets_sub._data.update(_scan1d_static(_SCAN1D_GHOST_PREFIX, completed=True))
        ghost_axis: List[float] = []
        ghost_channels: Dict[str, List[float]] = {k: [] for k in _SCAN1D_CHANNELS}
        for x in _scan1d_schedule():
            sample = _scan1d_sample(x, center=-8.0)
            ghost_axis.append(x)
            for k in _SCAN1D_CHANNELS:
                ghost_channels[k].append(sample[k])
        self._datasets_sub._data[f"{_SCAN1D_GHOST_PREFIX}.points.axis_0"] = [False, ghost_axis, {}]
        for k, vals in ghost_channels.items():
            self._datasets_sub._data[f"{_SCAN1D_GHOST_PREFIX}.points.channel_{k}"] = [False, vals, {}]

        # Seed the live 1D run (rid_4823) metadata and a randomized schedule.
        # Points are revealed in the update loop.
        self._datasets_sub._data.update(_scan1d_static(_SCAN1D_LIVE_PREFIX, completed=False))
        self._scan1d_schedule = _scan1d_schedule()
        self._scan1d_idx = 0
        self._datasets_sub._data[f"{_SCAN1D_LIVE_PREFIX}.points.axis_0"] = [False, [], {}]
        for k in _SCAN1D_CHANNELS:
            self._datasets_sub._data[f"{_SCAN1D_LIVE_PREFIX}.points.channel_{k}"] = [False, [], {}]

        self._task = asyncio.create_task(self._update_loop())
        self._started = True
        logger.info("Mock backend started (prefix=%s)", _PREFIX)

    async def stop(self) -> None:
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        self._started = False
        logger.info("Mock backend stopped")

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        return True

    async def _update_loop(self) -> None:
        while True:
            await asyncio.sleep(0.5)
            for ch, val in _generate_point_values().items():
                self._datasets_sub._set_and_notify(f"{_PREFIX}.point.{ch}", [False, val, {}])
            for i, spec in enumerate(_IMAGE_SPECS):
                self._datasets_sub._set_and_notify(
                    spec["key"],
                    [False, _generate_image(spec["size"], spec["kind"], seed=i * 1.7), {}],
                )
            self._step_live_scan1d()

    def _step_live_scan1d(self) -> None:
        """Reveal the next point of the live 1D scan, restarting the sweep when
        it completes (with a slowly drifting resonance to keep it lively)."""
        prefix = _SCAN1D_LIVE_PREFIX
        if self._scan1d_idx >= len(self._scan1d_schedule):
            # Sweep complete — reshuffle, nudge the resonance, and start over.
            self._scan1d_schedule = _scan1d_schedule()
            self._scan1d_idx = 0
            self._scan1d_center = max(-15.0, min(15.0, self._scan1d_center + random.uniform(-4.0, 4.0)))
            self._datasets_sub._set_and_notify(f"{prefix}.points.axis_0", [False, [], {}])
            for k in _SCAN1D_CHANNELS:
                self._datasets_sub._set_and_notify(f"{prefix}.points.channel_{k}", [False, [], {}])

        x = self._scan1d_schedule[self._scan1d_idx]
        self._scan1d_idx += 1
        sample = _scan1d_sample(x, self._scan1d_center)

        axis = list(self._datasets_sub._data[f"{prefix}.points.axis_0"][1])
        axis.append(x)
        self._datasets_sub._set_and_notify(f"{prefix}.points.axis_0", [False, axis, {}])
        for k in _SCAN1D_CHANNELS:
            vals = list(self._datasets_sub._data[f"{prefix}.points.channel_{k}"][1])
            vals.append(sample[k])
            self._datasets_sub._set_and_notify(f"{prefix}.points.channel_{k}", [False, vals, {}])

    # ── SubscriberManager interface ──────────────────────────────────────────

    def get_explist(self) -> Dict:
        return dict(_MOCK_EXPLIST)

    def get_explist_status(self) -> Dict:
        return {"cur_rev": "mock", "scanning": False}

    def examine_experiment(self, file: str, class_name: str, revision=None):
        """Return the static mock arginfo for *class_name*, or None if unknown.

        Mock mode has no real ARTIQ master/git backend, so *revision* is ignored and
        the existing mock explist arginfo is returned. This lets the frontend's
        "Recompute arguments" control be exercised under ``make mock``.
        """
        for entry in _MOCK_EXPLIST.values():
            if entry["file"] == file and entry["class_name"] == class_name:
                return entry.get("arginfo", {})
        return None

    def get_schedule(self) -> Dict:
        return dict(self._schedule)

    def submit(
        self,
        expid: dict,
        pipeline: str = "main",
        priority: int = 0,
        flush: bool = False,
        due_date: float | None = None,
    ) -> int:
        """Allocate a RID and insert a pending schedule item, mirroring
        control_schedule.submit_experiment's real-master signature so the API
        layer can call either one interchangeably in mock mode.

        Returns the new integer RID.
        """
        rid = self._next_rid
        self._next_rid += 1
        self._schedule[rid] = {
            "pipeline": pipeline,
            "priority": priority,
            "due_date": due_date,
            "flush": flush,
            "status": "pending",
            "repo_msg": None,
            "expid": expid,
        }
        logger.info("Mock schedule: submitted RID %d (%s/%s)", rid, expid.get("file"), expid.get("class_name"))
        return rid

    def cancel(self, rid: int) -> bool:
        """Remove *rid* from the mock schedule. Returns False if it was absent."""
        removed = self._schedule.pop(rid, None) is not None
        if removed:
            logger.info("Mock schedule: cancelled RID %d", rid)
        return removed

    def get_datasets(self) -> Dict:
        return self._datasets_sub.get_data()

    def get_datasets_subscriber(self) -> MockDatasetsSubscriber:
        return self._datasets_sub

    def get_logs(self) -> List:
        return []

    def get_logs_subscriber(self):
        return self._datasets_sub
