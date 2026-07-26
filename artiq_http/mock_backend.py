"""
Mock backend for frontend development.

Replaces the real SubscriberManager with a mock that serves plausible fake
data without requiring a running ARTIQ master.  Activated via --mock or
ARTIQ_HTTP_MOCK=1.

Serves one 0D repeat single-point NDScan (ndscan.rid_1) with four channels
whose values drift sinusoidally with Gaussian noise, updating every 0.5 s.

Also serves two 1D RabiFlop scans (rabi.pulse_duration, 101 points) so the
running schedule item and its live dataset agree with each other: a completed
run (ndscan.rid_4821, phase-shifted) usable as a ghost overlay, and the live
run (ndscan.rid_4823) whose points stream in a *randomized* order with
repeats at each x. The randomized order with repeats exercises the Plot1D
line rendering, which sorts points by x and draws the line through the per-x
mean with standard-error-of-the-mean error bars.

The explist also includes RabiFlop, a large (214-parameter) ndscan experiment
with a realistically nested fragment tree, and the mock schedule starts
pre-populated with a running RID (4823, RabiFlop) and a pending RID (4824,
CalibrateTrapFreq) so the queue/live UI has content immediately.

Submitting (POST /api/schedule or /api/scan) and cancelling (POST
/api/cancel) work against this in-memory mock schedule — RIDs are allocated
from a counter starting at 4825. A submission is inserted as `pending`, then
after a short delay flips to `running` and (for ndscan submissions) starts
streaming points derived from the axes actually submitted, completing and
leaving the schedule once every point is in — mirroring a real ARTIQ run's
lifecycle. A submission with no scan axes is treated as a single-point run
that completes immediately (real ndscan 0D runs measure once and complete,
see `NoAxesRunner`); a plain (non-ndscan) submission has no live data to
stream, so it is just removed from the schedule after a short simulated
run time.
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

# ── Submission lifecycle timings ─────────────────────────────────────────────
# A freshly submitted run sits as `pending` for this long before flipping to
# `running` and starting to stream data (mirrors ARTIQ's scheduler picking a
# job up off the queue). Kept short so the demo/screenshot workflow doesn't
# involve real waiting.
_SUBMIT_PENDING_DELAY_S = 2.0
# A plain (non-ndscan) submission has no live dataset to stream, so it just
# stays "running" for this long before being removed from the schedule.
_PLAIN_RUN_DURATION_S = 4.0
# How long a completed run's schedule item lingers (status `run_done`) before
# being dropped, matching a real ARTIQ master's brief post-completion delay.
_RUN_CLEANUP_DELAY_S = 4.0
# ndscan's real "run forever" sentinel for `scan.num_repeats`.
_INFINITE_REPEATS = 2147483647
# Safety valve: a submission whose declared point count would be enormous
# (e.g. num_repeats close to infinite but not quite) loops a single pass
# forever instead of trying to actually stream that many points.
_MAX_DEMO_POINTS = 4000
# Points are revealed a few at a time per tick so a huge scan doesn't take
# forever to visibly progress, while a small one still streams over several
# ticks rather than appearing all at once.
_POINTS_PER_TICK_TARGET_TICKS = 40

# Generic dataset channels used for freshly *submitted* runs (as opposed to
# the seeded RabiFlop/repeat demos, which have their own themed channels):
# `reference` is a negative-priority diagnostic (hidden by default) and
# `atom_number` is large-scale, so a submitted run also exercises the Plots
# view's scale-based channel grouping.
_GENERIC_SCAN_CHANNELS: Dict[str, Any] = {
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


def _linspace(start: float, stop: float, n: int) -> List[float]:
    if n <= 1:
        return [start]
    step = (stop - start) / (n - 1)
    return [start + step * i for i in range(n)]


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
# points x 2 repeats, so the frontend's progress derivation (state/useLiveRun.js
# runProgress()) reads a real "N/202" from expid.arguments.ndscan_params
# instead of a hardcoded string — see _RABI_SCAN_REPEATS below, which the
# seeded live dataset (ndscan.rid_4823) actually streams to match.
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
            "num_repeats": 2,
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


# ── Seeded RabiFlop 1D scans (ghost + live) ──────────────────────────────────
# Two runs of *the same experiment as the running schedule item* so the
# timeline can offer one as a ghost overlay of the other, and so the live
# pane's identity (fragment name, scanned axis, RID) is coherent end to end:
# RID 4823's schedule item declares a 101-point rabi.pulse_duration scan (see
# _RID_4823_NDSCAN_PARAMS above), and this dataset actually is that scan.
# rid_4823 is live and reveals its points in randomized order with repeats;
# rid_4821 is a completed run at a shifted phase, usable as a ghost overlay.
def _derive_fragment_fqn(file: str, class_name: str) -> str:
    """Best-effort mirror of ndscan's `Fragment.fqn` (module + qualname) for a
    module imported from *file* — matches the JS port `deriveFragmentFqn` in
    `mockAdapter.js`, used for freshly submitted runs. Applied here too so the
    seeded RabiFlop demo's fragment_fqn is derived the same way, rather than
    hand-typed and liable to drift from it."""
    module_path = file[:-3] if file.endswith(".py") else file
    module_path = module_path.replace("/", ".")
    return f"{module_path}.{class_name}"


_RABI_SCAN_FQN = _derive_fragment_fqn(_RABI_FLOP_FILE, _RABI_FLOP_CLASS)
_RABI_GHOST_PREFIX = "ndscan.rid_4821"
_RABI_LIVE_PREFIX = "ndscan.rid_4823"

# `excitation` (small scale, the important channel) plus a large-scale
# (~10⁴–10⁵) `atom_number`: their unrelated scales make the frontend's
# scale-based fallback group `atom_number` onto its own plot, exercising the
# fix for crushed shared y-axes. `dark_counts` is a negative-priority
# diagnostic, hidden by default so the plot opens on `excitation`/
# `atom_number` until the user enables it.
_RABI_SCAN_CHANNELS = {
    "excitation": {"path": "excitation", "description": "Excitation", "type": "float", "scale": 1.0, "unit": ""},
    "dark_counts": {
        "path": "dark_counts",
        "description": "Dark-state photon counts",
        "type": "float",
        "scale": 1.0,
        "unit": "",
        "display_hints": {"priority": -1},
    },
    "atom_number": {"path": "atom_number", "description": "Atom number", "type": "float", "scale": 1.0, "unit": ""},
}

# The scanned axis is rabi.pulse_duration itself (raw seconds, same as the
# `range` above — ndscan's `.axes`/`.points.axis_0` datasets are always in raw
# param units, never display-scaled), built from the same hand-written schema
# body used for the RabiFlop arginfo so the two can't drift apart.
_RABI_PULSE_DURATION_SCHEMA = _hand_written_rabi_flop_params()["rabi.pulse_duration"]
_RABI_SCAN_RANGE = {"start": 1e-6, "stop": 5e-5, "num_points": 101}
_RABI_SCAN_X_POINTS = _linspace(_RABI_SCAN_RANGE["start"], _RABI_SCAN_RANGE["stop"], _RABI_SCAN_RANGE["num_points"])
_RABI_SCAN_AXIS = {
    "increment": (_RABI_SCAN_RANGE["stop"] - _RABI_SCAN_RANGE["start"]) / (_RABI_SCAN_RANGE["num_points"] - 1),
    "max": _RABI_SCAN_RANGE["stop"],
    "min": _RABI_SCAN_RANGE["start"],
    "path": "",
    "param": {
        "fqn": "rabi.pulse_duration",
        "unit": _RABI_PULSE_DURATION_SCHEMA["spec"]["unit"],
        **_RABI_PULSE_DURATION_SCHEMA,
    },
}

# Each x point is measured _RABI_SCAN_REPEATS times (matching the schedule
# item's declared num_repeats: 2, see _RID_4823_NDSCAN_PARAMS) so the total
# streamed point count agrees with the "N/202" progress the frontend derives
# from the schedule item, and so the randomized-order-with-repeats behaviour
# exercises Plot1D's per-x mean/SEM error-bar rendering.
_RABI_SCAN_REPEATS = 2
# The ghost run's phase is shifted from the live run's so the overlay is
# visibly distinguishable (a ghost of an identical curve would be pointless).
_RABI_GHOST_PHASE_SHIFT = 3e-6
_RABI_PERIOD_S = 12e-6  # ~12 us Rabi period, chosen to show a few oscillations across the 1-50 us scan range


def _rabi_sample(t: float, phase_shift: float) -> Dict[str, float]:
    """A noisy Rabi oscillation in `excitation` as a function of pulse
    duration *t* (raw seconds), a flat-ish `dark_counts` diagnostic, and a
    large-scale `atom_number` (~10⁴–10⁵) that tracks the oscillation."""
    excitation = 0.5 - 0.5 * math.cos(2 * math.pi * (t - phase_shift) / _RABI_PERIOD_S)
    excitation = max(0.0, min(1.0, excitation + random.gauss(0, 0.04)))
    dark_counts = 0.5 + random.gauss(0, 0.03)
    atom_number = 50000.0 + 30000.0 * excitation + random.gauss(0, 3000.0)
    return {"excitation": excitation, "dark_counts": dark_counts, "atom_number": atom_number}


def _rabi_scan_plan() -> List[float]:
    """A randomized measurement order: each x point repeated _RABI_SCAN_REPEATS times."""
    plan = [x for x in _RABI_SCAN_X_POINTS for _ in range(_RABI_SCAN_REPEATS)]
    random.shuffle(plan)
    return plan


def _rabi_scan_static(prefix: str, completed: bool) -> Dict[str, Any]:
    """Static (metadata) datasets shared by both RabiFlop 1D runs."""
    return {
        f"{prefix}.axes": [False, json.dumps([_RABI_SCAN_AXIS]), {}],
        f"{prefix}.channels": [False, json.dumps(_RABI_SCAN_CHANNELS), {}],
        f"{prefix}.fragment_fqn": [False, _RABI_SCAN_FQN, {}],
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


# ── Freshly-submitted ndscan run helpers ─────────────────────────────────────
# Ports of the equivalent logic in mockAdapter.js (getNdscanJson,
# axisPointValues, axisDescriptorForDataset, cartesianProduct,
# buildShuffledPlan, sampleChannelsGeneric, nudgeCenter) — kept in sync by
# hand so a submitted run behaves identically in both mocks. These are
# free functions (as opposed to the ndscan_builder.py/ndscan_validation.py
# modules that actually build/validate the *request*) because by the time
# `_start_run_from_expid` runs, the request has already been accepted and
# turned into an ExpID; this only concerns itself with turning that ExpID's
# ndscan_params back into believable streamed data.


def _get_ndscan_json(arguments: Dict[str, Any]) -> Optional[str]:
    v = (arguments or {}).get("ndscan_params")
    if v is None:
        return None
    if isinstance(v, str):
        return v
    if isinstance(v, list) and v:
        spec = v[0]
        if isinstance(spec, dict) and isinstance(spec.get("default"), str):
            return spec["default"]
    return None


def _axis_point_values(axis_wire: Dict[str, Any]) -> List[float]:
    rng = axis_wire.get("range") or {}
    gtype = axis_wire.get("type")
    if gtype == "list":
        return list(rng.get("values") or [])
    if gtype == "linear":
        return _linspace(float(rng["start"]), float(rng["stop"]), int(rng["num_points"]))
    if gtype == "centre_span":
        centre = float(rng["centre"])
        half_span = float(rng["half_span"])
        return _linspace(centre - half_span, centre + half_span, int(rng["num_points"]))
    return [0.0]


def _extract_schemata_from_arginfo(arginfo: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    if not arginfo:
        return {}
    ndscan_params = arginfo.get("ndscan_params")
    if not isinstance(ndscan_params, list) or not ndscan_params:
        return {}
    spec = ndscan_params[0]
    if not isinstance(spec, dict) or not isinstance(spec.get("default"), str):
        return {}
    try:
        parsed = json.loads(spec["default"])
    except (TypeError, ValueError):
        return {}
    schemata = parsed.get("schemata") if isinstance(parsed, dict) else None
    return schemata if isinstance(schemata, dict) else {}


def _axis_descriptor_for_dataset(
    axis_wire: Dict[str, Any], arginfo: Optional[Dict[str, Any]], values: List[float]
) -> Dict[str, Any]:
    lo, hi = min(values), max(values)
    increment = (hi - lo) / (len(values) - 1) if len(values) > 1 else 0.0
    schema = _extract_schemata_from_arginfo(arginfo).get(axis_wire["fqn"])
    if schema:
        param = dict(schema)
        param["unit"] = (schema.get("spec") or {}).get("unit", "")
    else:
        param = {
            "default": "0",
            "description": axis_wire["fqn"],
            "type": "float",
            "spec": {"is_scannable": True, "scale": 1},
            "unit": "",
        }
    param.setdefault("fqn", axis_wire["fqn"])
    return {"increment": increment, "max": hi, "min": lo, "path": axis_wire.get("path", "*"), "param": param}


def _cartesian_product(value_arrays: List[List[float]]) -> List[List[float]]:
    acc: List[List[float]] = [[]]
    for values in value_arrays:
        acc = [prefix_pt + [v] for prefix_pt in acc for v in values]
    return acc


def _build_shuffled_plan(grid: List[List[float]], repeats: int) -> List[List[float]]:
    plan: List[List[float]] = []
    for _ in range(repeats):
        plan.extend(grid)
    random.shuffle(plan)
    return plan


def _sample_channels_generic(pt: List[float], center: List[float], axis_spans: List[tuple]) -> Dict[str, float]:
    dist_sq = 0.0
    for i, value in enumerate(pt):
        lo, hi = axis_spans[i]
        span = (hi - lo) or 1.0
        norm = (value - center[i]) / (span * 0.25)
        dist_sq += norm * norm
    bump = 1.0 / (1.0 + dist_sq)
    return {
        "signal": 0.12 + 0.8 * bump + random.gauss(0, 0.05),
        "reference": 0.5 + random.gauss(0, 0.03),
        "atom_number": max(0.0, 50000.0 + 30000.0 * bump + random.gauss(0, 3000.0)),
    }


def _nudge_center(run: Dict[str, Any]) -> None:
    new_center = []
    for c, (lo, hi) in zip(run["center"], run["axis_spans"]):
        span = (hi - lo) or 1.0
        candidate = c + (random.random() * 2 - 1) * span * 0.15
        new_center.append(max(lo, min(hi, candidate)))
    run["center"] = new_center


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
        # Live RabiFlop scan progress (rid_4823): a randomized measurement plan
        # that is revealed one point per tick and reshuffled once exhausted.
        # This seeded demo runs forever (it never leaves the schedule) — unlike
        # genuinely *submitted* runs, see _active_runs below.
        self._rabi_scan_plan_state: List[float] = []
        self._rabi_scan_idx = 0
        self._rabi_scan_phase_shift = 0.0
        # In-memory mock schedule (RID -> ScheduleItem-shaped dict), seeded with
        # a running and a pending item; submit()/cancel() mutate this directly so
        # the submit -> queue -> live flow is exercisable without a real master.
        self._schedule: Dict[int, Dict[str, Any]] = {}
        self._next_rid = _FIRST_ALLOCATED_RID
        # Genuinely submitted runs go through pending -> running -> (streaming
        # points ->) completed/removed. `_active_runs` holds the streaming state
        # for runs currently revealing points (see _begin_ndscan_run /
        # _tick_ndscan_run); `_pending_activation_tasks` holds each submission's
        # pending->running timer; `_cleanup_tasks` holds either a completed run's
        # removal timer or a plain (non-ndscan) submission's auto-completion
        # timer. All are cancelled/cleared on cancel()/stop() so nothing fires
        # after a RID is gone or the manager is torn down.
        self._active_runs: Dict[int, Dict[str, Any]] = {}
        self._pending_activation_tasks: Dict[int, asyncio.Task] = {}
        self._cleanup_tasks: Dict[int, asyncio.Task] = {}

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

        # Seed the completed RabiFlop ghost run (rid_4821): a full sweep at a
        # shifted phase so it visibly differs from the live run.
        self._datasets_sub._data.update(_rabi_scan_static(_RABI_GHOST_PREFIX, completed=True))
        ghost_axis: List[float] = []
        ghost_channels: Dict[str, List[float]] = {k: [] for k in _RABI_SCAN_CHANNELS}
        for x in _rabi_scan_plan():
            sample = _rabi_sample(x, _RABI_GHOST_PHASE_SHIFT)
            ghost_axis.append(x)
            for k in _RABI_SCAN_CHANNELS:
                ghost_channels[k].append(sample[k])
        self._datasets_sub._data[f"{_RABI_GHOST_PREFIX}.points.axis_0"] = [False, ghost_axis, {}]
        for k, vals in ghost_channels.items():
            self._datasets_sub._data[f"{_RABI_GHOST_PREFIX}.points.channel_{k}"] = [False, vals, {}]

        # Seed the live RabiFlop run (rid_4823) metadata and a randomized measurement
        # plan matching the running schedule item. Points are revealed in the update loop.
        self._datasets_sub._data.update(_rabi_scan_static(_RABI_LIVE_PREFIX, completed=False))
        self._rabi_scan_plan_state = _rabi_scan_plan()
        self._rabi_scan_idx = 0
        self._rabi_scan_phase_shift = 0.0
        self._datasets_sub._data[f"{_RABI_LIVE_PREFIX}.points.axis_0"] = [False, [], {}]
        for k in _RABI_SCAN_CHANNELS:
            self._datasets_sub._data[f"{_RABI_LIVE_PREFIX}.points.channel_{k}"] = [False, [], {}]

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
        pending_tasks = [*self._pending_activation_tasks.values(), *self._cleanup_tasks.values()]
        for task in pending_tasks:
            task.cancel()
        if pending_tasks:
            await asyncio.gather(*pending_tasks, return_exceptions=True)
        self._pending_activation_tasks.clear()
        self._cleanup_tasks.clear()
        self._active_runs.clear()
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
            self._step_live_rabi_scan()
            for rid in list(self._active_runs):
                run = self._active_runs.get(rid)
                if run is not None:
                    self._tick_ndscan_run(run)

    def _step_live_rabi_scan(self) -> None:
        """Reveal the next point of the seeded live RabiFlop scan (rid_4823),
        restarting the sweep when it completes (with a slowly drifting phase to
        keep it lively). This is the perpetual demo run — see `_tick_ndscan_run`
        for the (terminating) lifecycle of a genuinely submitted scan."""
        prefix = _RABI_LIVE_PREFIX
        if self._rabi_scan_idx >= len(self._rabi_scan_plan_state):
            # Sweep complete — reshuffle, nudge the phase, and start over.
            self._rabi_scan_plan_state = _rabi_scan_plan()
            self._rabi_scan_idx = 0
            self._rabi_scan_phase_shift = max(
                _RABI_SCAN_RANGE["start"],
                min(_RABI_SCAN_RANGE["stop"], self._rabi_scan_phase_shift + random.uniform(-5e-6, 5e-6)),
            )
            self._datasets_sub._set_and_notify(f"{prefix}.points.axis_0", [False, [], {}])
            for k in _RABI_SCAN_CHANNELS:
                self._datasets_sub._set_and_notify(f"{prefix}.points.channel_{k}", [False, [], {}])

        x = self._rabi_scan_plan_state[self._rabi_scan_idx]
        self._rabi_scan_idx += 1
        sample = _rabi_sample(x, self._rabi_scan_phase_shift)

        axis = list(self._datasets_sub._data[f"{prefix}.points.axis_0"][1])
        axis.append(x)
        self._datasets_sub._set_and_notify(f"{prefix}.points.axis_0", [False, axis, {}])
        for k in _RABI_SCAN_CHANNELS:
            vals = list(self._datasets_sub._data[f"{prefix}.points.channel_{k}"][1])
            vals.append(sample[k])
            self._datasets_sub._set_and_notify(f"{prefix}.points.channel_{k}", [False, vals, {}])

    # ── Genuinely submitted runs: pending -> running -> streaming -> completed ──

    async def _activate_submission(self, rid: int) -> None:
        """After the pending delay, flip *rid* to `running` and start its data
        (unless it was cancelled in the meantime)."""
        try:
            await asyncio.sleep(_SUBMIT_PENDING_DELAY_S)
        except asyncio.CancelledError:
            return
        self._pending_activation_tasks.pop(rid, None)
        item = self._schedule.get(rid)
        if item is None or item["status"] != "pending":
            return
        item["status"] = "running"
        self._start_run_from_expid(rid, item["expid"])

    def _start_run_from_expid(self, rid: int, expid: Dict[str, Any]) -> None:
        raw = _get_ndscan_json(expid.get("arguments") or {})
        if raw is None:
            # Plain (non-ndscan) experiment: nothing to stream. Simulate a quick
            # job rather than leaving a "running" item stuck forever with no
            # live data.
            task = asyncio.create_task(self._complete_plain_after_delay(rid))
            self._cleanup_tasks[rid] = task
            return
        try:
            parsed = json.loads(raw)
        except (TypeError, ValueError):
            return
        scan = parsed.get("scan") if isinstance(parsed, dict) else None
        axes = (scan or {}).get("axes") or []
        num_repeats = (scan or {}).get("num_repeats", 1)
        arginfo = self.examine_experiment(expid.get("file"), expid.get("class_name"))
        self._begin_ndscan_run(rid, expid, axes, num_repeats, arginfo)

    async def _complete_plain_after_delay(self, rid: int) -> None:
        try:
            await asyncio.sleep(_PLAIN_RUN_DURATION_S)
        except asyncio.CancelledError:
            return
        self._cleanup_tasks.pop(rid, None)
        self._schedule.pop(rid, None)

    def _begin_zero_axis_run(self, rid: int, prefix: str, fragment_fqn: str) -> None:
        """No scanned axes: a real ndscan 0D run measures once and completes
        immediately (see `_NoAxisRunner` in ndscan/experiment/entry_point.py),
        so this publishes one point and completes rather than ticking forever
        like the always-live 0D repeat demo (`_PREFIX`, rid_1) does."""
        sub = self._datasets_sub
        sample = {
            "signal": 0.5 + random.gauss(0, 0.05),
            "reference": 0.5 + random.gauss(0, 0.03),
            "atom_number": 50000.0 + random.gauss(0, 3000.0),
        }
        sub._set_and_notify(f"{prefix}.axes", [False, "[]", {}])
        sub._set_and_notify(f"{prefix}.channels", [False, json.dumps(_GENERIC_SCAN_CHANNELS), {}])
        sub._set_and_notify(f"{prefix}.fragment_fqn", [False, fragment_fqn, {}])
        for key, value in sample.items():
            sub._set_and_notify(f"{prefix}.point.{key}", [False, value, {}])
        sub._set_and_notify(f"{prefix}.completed", [False, True, {}])
        self._finish_run(rid, prefix)

    def _begin_ndscan_run(
        self,
        rid: int,
        expid: Dict[str, Any],
        axes_wire: List[Dict[str, Any]],
        num_repeats_raw: Any,
        arginfo: Optional[Dict[str, Any]],
    ) -> None:
        prefix = f"ndscan.rid_{rid}"
        fragment_fqn = _derive_fragment_fqn(expid["file"], expid["class_name"])

        if not axes_wire:
            self._begin_zero_axis_run(rid, prefix, fragment_fqn)
            return

        value_arrays = [_axis_point_values(ax) for ax in axes_wire]
        descriptors = [_axis_descriptor_for_dataset(ax, arginfo, vals) for ax, vals in zip(axes_wire, value_arrays)]
        sub = self._datasets_sub
        sub._set_and_notify(f"{prefix}.axes", [False, json.dumps(descriptors), {}])
        sub._set_and_notify(f"{prefix}.channels", [False, json.dumps(_GENERIC_SCAN_CHANNELS), {}])
        sub._set_and_notify(f"{prefix}.fragment_fqn", [False, fragment_fqn, {}])
        sub._set_and_notify(f"{prefix}.completed", [False, False, {}])
        for i in range(len(axes_wire)):
            sub._set_and_notify(f"{prefix}.points.axis_{i}", [False, [], {}])
        for key in _GENERIC_SCAN_CHANNELS:
            sub._set_and_notify(f"{prefix}.points.channel_{key}", [False, [], {}])

        grid = _cartesian_product(value_arrays)
        grid_size = len(grid)
        num_repeats = num_repeats_raw if isinstance(num_repeats_raw, int) else 1
        is_infinite = num_repeats == _INFINITE_REPEATS
        finite_total = None if is_infinite else grid_size * max(1, num_repeats)
        loop_forever = is_infinite or grid_size == 0 or (finite_total is not None and finite_total > _MAX_DEMO_POINTS)

        center = [vals[int(len(vals) * 0.4)] if vals else 0.0 for vals in value_arrays]
        run: Dict[str, Any] = {
            "rid": rid,
            "prefix": prefix,
            "num_axes": len(axes_wire),
            "grid": grid,
            "center": center,
            "axis_spans": [(min(vals), max(vals)) for vals in value_arrays],
            "loop_forever": loop_forever,
            "plan": _build_shuffled_plan(grid, 1 if loop_forever else max(1, num_repeats)),
            "idx": 0,
            "done": False,
        }
        run["points_per_tick"] = max(1, math.ceil(len(run["plan"]) / _POINTS_PER_TICK_TARGET_TICKS))
        self._active_runs[rid] = run

    def _append_point(self, run: Dict[str, Any], pt: List[float]) -> None:
        sub = self._datasets_sub
        for i in range(run["num_axes"]):
            key = f"{run['prefix']}.points.axis_{i}"
            arr = list(sub._data.get(key, [False, [], {}])[1])
            arr.append(pt[i])
            sub._set_and_notify(key, [False, arr, {}])
        sample = _sample_channels_generic(pt, run["center"], run["axis_spans"])
        for ch_key, value in sample.items():
            key = f"{run['prefix']}.points.channel_{ch_key}"
            arr = list(sub._data.get(key, [False, [], {}])[1])
            arr.append(value)
            sub._set_and_notify(key, [False, arr, {}])

    def _reset_run_points(self, run: Dict[str, Any]) -> None:
        sub = self._datasets_sub
        for i in range(run["num_axes"]):
            sub._set_and_notify(f"{run['prefix']}.points.axis_{i}", [False, [], {}])
        for key in _GENERIC_SCAN_CHANNELS:
            sub._set_and_notify(f"{run['prefix']}.points.channel_{key}", [False, [], {}])

    def _tick_ndscan_run(self, run: Dict[str, Any]) -> None:
        if run["done"]:
            return
        remaining = run["points_per_tick"]
        while remaining > 0:
            if run["idx"] >= len(run["plan"]):
                if run["loop_forever"]:
                    run["plan"] = _build_shuffled_plan(run["grid"], 1)
                    run["idx"] = 0
                    _nudge_center(run)
                    self._reset_run_points(run)
                else:
                    run["done"] = True
                    self._finish_run(run["rid"], run["prefix"])
                    return
            if run["idx"] >= len(run["plan"]):
                return  # defensive: empty grid
            self._append_point(run, run["plan"][run["idx"]])
            run["idx"] += 1
            remaining -= 1

    def _finish_run(self, rid: int, prefix: str) -> None:
        """Mark *rid*'s dataset completed and its schedule item `run_done`, then
        remove it from the schedule after a short delay — mirroring a real
        ARTIQ master dropping a finished run off the queue."""
        self._active_runs.pop(rid, None)
        self._datasets_sub._set_and_notify(f"{prefix}.completed", [False, True, {}])
        item = self._schedule.get(rid)
        if item is not None:
            item["status"] = "run_done"
        task = asyncio.create_task(self._cleanup_after_delay(rid))
        self._cleanup_tasks[rid] = task

    async def _cleanup_after_delay(self, rid: int) -> None:
        try:
            await asyncio.sleep(_RUN_CLEANUP_DELAY_S)
        except asyncio.CancelledError:
            return
        self._cleanup_tasks.pop(rid, None)
        self._schedule.pop(rid, None)

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

        The item stays `pending` until `_activate_submission` (scheduled below)
        flips it to `running` after `_SUBMIT_PENDING_DELAY_S` and starts
        streaming its data, so the caller sees a realistic queue -> live
        lifecycle rather than a submission stuck pending forever.

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
        self._pending_activation_tasks[rid] = asyncio.create_task(self._activate_submission(rid))
        return rid

    def cancel(self, rid: int) -> bool:
        """Remove *rid* from the mock schedule (and stop/clean up any streaming
        or pending-activation state for it). Returns False if it was absent."""
        removed = self._schedule.pop(rid, None) is not None
        if removed:
            run = self._active_runs.pop(rid, None)
            if run is not None:
                self._datasets_sub._set_and_notify(f"{run['prefix']}.completed", [False, True, {}])
            for task_map in (self._pending_activation_tasks, self._cleanup_tasks):
                task = task_map.pop(rid, None)
                if task is not None:
                    task.cancel()
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
