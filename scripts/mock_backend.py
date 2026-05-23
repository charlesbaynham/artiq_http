"""Minimal FastAPI mock that mimics the ARTIQ HTTP dataset endpoints with
synthetic NDScan data, so the frontend can be screenshotted without a real
ARTIQ master. Used by `scripts/take_screenshots.sh` only.
"""

from __future__ import annotations

import asyncio
import json
import math
import random
from typing import Any

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

random.seed(42)


def gauss(rng: random.Random, mu: float = 0.0, sigma: float = 1.0) -> float:
    return rng.gauss(mu, sigma)


def make_rabi_1d(rid: int, n: int = 80, omega: float = 9.4, decay: float = 1.6) -> dict[str, Any]:
    rng = random.Random(rid)
    xs = [(i / (n - 1)) * 1.0 for i in range(n)]
    readout, dark, branching, heat_rate = [], [], [], []
    for x in xs:
        env = math.exp(-x / decay)
        pop = (1 - math.cos(omega * x)) / 2 * env
        readout.append(max(0.0, min(1.0, pop + gauss(rng, 0, 0.018))))
        dark.append(max(0.0, min(1.0, (1 - pop) * 0.95 + gauss(rng, 0, 0.014))))
        branching.append(max(0.0, min(1.0, 0.04 + gauss(rng, 0, 0.008))))
        heat_rate.append(0.5 + gauss(rng, 0, 0.05))
    axes = [{"param": {"description": "amplitude", "fqn": "rabi_amp.amp", "unit": "V"}}]
    channels = {
        "readout_pop": {"type": "float", "unit": ""},
        "dark_state": {"type": "float", "unit": ""},
        "branching": {"type": "float", "unit": ""},
        "heat_rate": {"type": "float", "unit": "1/s"},
    }
    return {
        "prefix": f"ndscan.rid_{rid}",
        "fragment_fqn": "ndscan.experiments.rabi_amp",
        "axes": axes,
        "channels": channels,
        "axis_values": [xs],
        "channel_values": {
            "readout_pop": readout,
            "dark_state": dark,
            "branching": branching,
            "heat_rate": heat_rate,
        },
        "completed": True,
    }


def make_ramsey_2d(rid: int, cols: int = 48, rows: int = 24) -> dict[str, Any]:
    rng = random.Random(rid)
    xs_flat, ys_flat, vals_flat = [], [], []
    for r in range(rows):
        for c in range(cols):
            f = -20 + (c / (cols - 1)) * 40
            phi = -math.pi + (r / (rows - 1)) * 2 * math.pi
            env = math.exp(-(f * f) / (24 * 24)) * math.exp(-30 / 60)
            v = 0.5 + 0.5 * math.cos(2 * math.pi * f * 0.08 + phi) * env
            v = max(0.0, min(1.0, v + gauss(rng, 0, 0.015)))
            xs_flat.append(f)
            ys_flat.append(phi)
            vals_flat.append(v)
    axes = [
        {"param": {"description": "freq", "fqn": "ramsey.freq", "unit": "MHz"}},
        {"param": {"description": "phase", "fqn": "ramsey.phase", "unit": "rad"}},
    ]
    channels = {
        "readout_pop": {"type": "float", "unit": ""},
        "dark_state": {"type": "float", "unit": ""},
    }
    return {
        "prefix": f"ndscan.rid_{rid}",
        "fragment_fqn": "ndscan.experiments.ramsey",
        "axes": axes,
        "channels": channels,
        "axis_values": [xs_flat, ys_flat],
        "channel_values": {
            "readout_pop": vals_flat,
            "dark_state": [1.0 - v for v in vals_flat],
        },
        "completed": True,
    }


def make_ion_0d(rid: int) -> dict[str, Any]:
    rng = random.Random(rid)
    return {
        "prefix": f"ndscan.rid_{rid}",
        "fragment_fqn": "ndscan.experiments.ion_monitor",
        "axes": [],
        "channels": {
            "readout_pop": {"type": "float", "unit": ""},
            "dark_state": {"type": "float", "unit": ""},
            "branching": {"type": "float", "unit": ""},
        },
        "axis_values": [],
        "channel_values": {},
        "point_values": {
            "readout_pop": 0.612 + gauss(rng, 0, 0.012),
            "dark_state": 0.388 + gauss(rng, 0, 0.014),
            "branching": 0.041 + gauss(rng, 0, 0.008),
        },
        "completed": False,
    }


RUNS = [
    make_rabi_1d(1042),
    make_rabi_1d(1037, omega=9.55, decay=1.55),
    make_rabi_1d(1029, omega=9.10, decay=1.45),
    make_ramsey_2d(1041),
    make_ramsey_2d(1033),
    make_ion_0d(1040),
]


def build_dataset_bag() -> dict[str, list]:
    """Flatten all runs into the {key: [persist, value]} bag the frontend expects."""
    bag: dict[str, list] = {}
    for run in RUNS:
        p = run["prefix"]
        bag[f"{p}.fragment_fqn"] = [True, run["fragment_fqn"]]
        bag[f"{p}.axes"] = [True, json.dumps(run["axes"])]
        bag[f"{p}.channels"] = [True, json.dumps(run["channels"])]
        bag[f"{p}.completed"] = [True, run["completed"]]
        for i, av in enumerate(run["axis_values"]):
            bag[f"{p}.points.axis_{i}"] = [True, av]
        for ch, vs in run["channel_values"].items():
            bag[f"{p}.points.channel_{ch}"] = [True, vs]
        for ch, v in run.get("point_values", {}).items():
            bag[f"{p}.point.{ch}"] = [True, v]
    return bag


DATASETS = build_dataset_bag()


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return {"artiq_connected": True}


@app.get("/api/datasets/names")
async def names() -> dict[str, Any]:
    return {"names": list(DATASETS.keys())}


@app.get("/api/datasets/values")
async def values(names: str) -> dict[str, Any]:
    requested = [n.strip() for n in names.split(",") if n.strip()]
    return {n: DATASETS[n] for n in requested if n in DATASETS}


@app.get("/api/datasets/stream/{prefix:path}")
async def stream(prefix: str) -> Response:
    bag = {k: v for k, v in DATASETS.items() if k.startswith(prefix + ".")}

    async def gen():
        yield f"event: init\ndata: {json.dumps(bag)}\n\n"
        # one heartbeat so the connection stays "connected" then idle
        while True:
            await asyncio.sleep(15)
            yield "event: heartbeat\ndata: {}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")


@app.get("/api/explist")
async def explist() -> dict[str, Any]:
    return {"current_rev": "mock", "scanning": False, "experiments": []}


@app.get("/api/schedule")
async def schedule() -> dict[str, Any]:
    return {}


@app.get("/api/logs")
async def logs() -> dict[str, Any]:
    return {"logs": []}
