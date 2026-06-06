"""
Mock backend for frontend development.

Replaces the real SubscriberManager with a mock that serves plausible fake
data without requiring a running ARTIQ master.  Activated via --mock or
ARTIQ_HTTP_MOCK=1.

Serves one 0D repeat single-point NDScan (ndscan.rid_1) with four channels
whose values drift sinusoidally with Gaussian noise, updating every 0.5 s.
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

_CHANNELS = {
    "ch0": {"path": "ch0", "description": "Signal A", "type": "float", "scale": 1.0, "unit": ""},
    "ch1": {"path": "ch1", "description": "Signal B", "type": "float", "scale": 1.0, "unit": ""},
    "ch2": {"path": "ch2", "description": "Signal C", "type": "float", "scale": 1.0, "unit": ""},
    "ch3": {"path": "ch3", "description": "Signal D", "type": "float", "scale": 1.0, "unit": ""},
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
    }
}


_IMAGE_SIZE = 64
_IMAGE_KEY = "camera_image"


def _generate_image() -> list:
    """Generate a 64×64 grayscale image with a drifting Gaussian blob."""
    t = time.time()
    cx = _IMAGE_SIZE / 2 + 20 * math.sin(t * 0.3)
    cy = _IMAGE_SIZE / 2 + 20 * math.cos(t * 0.2)
    sigma = 8 + 4 * math.sin(t * 0.15)
    rows = []
    for row in range(_IMAGE_SIZE):
        r = []
        for col in range(_IMAGE_SIZE):
            v = 220 * math.exp(-((row - cy) ** 2 + (col - cx) ** 2) / (2 * sigma**2))
            v += random.gauss(0, 4)
            r.append(max(0, min(255, int(v))))
        rows.append(r)
    return rows


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

    async def start(self) -> None:
        if self._started:
            return
        # Seed static datasets
        self._datasets_sub._data.update(_STATIC_DATASETS)
        # Seed initial point values
        for ch, val in _generate_point_values().items():
            self._datasets_sub._data[f"{_PREFIX}.point.{ch}"] = [False, val, {}]
        # Seed initial image
        self._datasets_sub._data[_IMAGE_KEY] = [False, _generate_image(), {}]

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
            self._datasets_sub._set_and_notify(_IMAGE_KEY, [False, _generate_image(), {}])

    # ── SubscriberManager interface ──────────────────────────────────────────

    def get_explist(self) -> Dict:
        return dict(_MOCK_EXPLIST)

    def get_explist_status(self) -> Dict:
        return {"cur_rev": "mock", "scanning": False}

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
