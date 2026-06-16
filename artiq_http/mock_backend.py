"""
Mock backend for frontend development.

Replaces the real SubscriberManager with a mock that serves plausible fake
data without requiring a running ARTIQ master.  Activated via --mock or
ARTIQ_HTTP_MOCK=1.

Serves one 0D repeat single-point NDScan (ndscan.rid_1) with four channels
whose values drift sinusoidally with Gaussian noise, updating every 0.5 s.

Also serves two 1D frequency-scan NDScans of the same experiment
(mock.MockFreqScan): a completed run (ndscan.rid_2) usable as a ghost overlay,
and a live run (ndscan.rid_3) whose points stream in a *randomized* order with
repeats at each x. The randomized order with repeats exercises the Plot1D line
rendering, which sorts points by x and draws the line through the per-x mean
with standard-error-of-the-mean error bars.
"""

import asyncio
import json
import logging
import math
import random
import time
from typing import Any, Callable, Dict, List

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

_MOCK_EXPLIST = {
    "MockRepeatExperiment": {
        "file": "mock_experiment.py",
        "class_name": "MockRepeatExperiment",
        "arginfo": {},
        "argument_ui": None,
        "scheduler_defaults": {},
        "docstring": "Mock repeat experiment for frontend development",
    },
    "MockFreqScan": {
        "file": "mock_experiment.py",
        "class_name": "MockFreqScan",
        "arginfo": {},
        "argument_ui": None,
        "scheduler_defaults": {},
        "docstring": "Mock 1D frequency scan for frontend development",
    },
}


# ── 1D frequency-scan mocks ──────────────────────────────────────────────────
# Two runs of the same experiment so the timeline can offer one as a ghost
# overlay of the other. rid_3 is live and reveals its points in randomized
# order with repeats; rid_2 is a completed run with a shifted resonance.
_SCAN1D_FQN = "mock.MockFreqScan"
_SCAN1D_GHOST_PREFIX = "ndscan.rid_2"
_SCAN1D_LIVE_PREFIX = "ndscan.rid_3"

# `reference` is a negative-priority diagnostic channel: hidden by default so the
# plot opens on the important `signal` channel only (see `_CHANNELS` above).
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
    """A noisy Lorentzian resonance in `signal`, plus a flat-ish `reference`."""
    width = 6.0
    signal = 0.12 + 0.8 / (1.0 + ((x - center) / width) ** 2) + random.gauss(0, 0.05)
    reference = 0.5 + random.gauss(0, 0.03)
    return {"signal": signal, "reference": reference}


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
        # Live 1D scan progress (rid_3): a randomized measurement schedule that
        # is revealed one point per tick and reshuffled once exhausted.
        self._scan1d_schedule: List[float] = []
        self._scan1d_idx = 0
        self._scan1d_center = 0.0

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

        # Seed the completed 1D ghost run (rid_2): a full sweep with a shifted
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

        # Seed the live 1D run (rid_3) metadata and a randomized schedule. Points
        # are revealed in the update loop.
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
        return {}

    def get_datasets(self) -> Dict:
        return self._datasets_sub.get_data()

    def get_datasets_subscriber(self) -> MockDatasetsSubscriber:
        return self._datasets_sub

    def get_logs(self) -> List:
        return []

    def get_logs_subscriber(self):
        return self._datasets_sub
