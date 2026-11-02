#!/usr/bin/env python3
"""Generate the static JSON fixtures backing the GitHub Pages mock demo.

This is the **single source of truth** for `frontend/src/api/mockAdapter.js`
(the browser-side fetch/EventSource shim that lets the redesigned bench run as
a fully static site, with no Python backend at all): it imports
`artiq_http.mock_backend` directly — no server, no network — and dumps its
in-memory state to JSON under `frontend/public/mock/`. The committed fixtures
are checked for drift by `tests/test_mock_fixtures.py`, which regenerates into
a temp dir and diffs against what's committed, so the Python mock and the
JS mock cannot silently diverge.

Because `mock_backend`'s initial dataset snapshot (point values, camera
images, the ghost 1D scan's sampled points) is built from `random`/`time`, we
seed the RNG and freeze the clock before capturing it so this script is
byte-for-byte reproducible — required for the drift test to be meaningful.
We capture the snapshot synchronously right after `MockSubscriberManager.start()`
returns and before yielding control back to the event loop, so the background
`_update_loop()` task (which would otherwise perturb the snapshot on its first
tick) has not run yet.

Fixture -> real endpoint mapping (see IMPL-SPEC.md #17 and mockAdapter.js for
how each one is served):
  explist.json          GET /api/explist (full=True, all fields)
  arginfo/<slug>.json   GET /api/explist/{file}/{class_name}/arginfo, one file
                         per experiment. `<slug>` is a filesystem-safe encoding
                         of `<file>:<class_name>` — see `slugify()` below. The
                         exact same algorithm is reimplemented in
                         mockAdapter.js (see the comment there); if you change
                         one, change the other.
  schedule.json          GET /api/schedule (the mock's seeded initial state)
  dataset_names.json     GET /api/datasets/names
  datasets.json          GET /api/datasets (initial snapshot)
  logs.json              GET /api/logs
  health.json            GET /api/health

Usage:
    uv run python scripts/generate_mock_fixtures.py [--out DIR]

`--out` is used by the drift test to regenerate into a tmp dir; the default is
`frontend/public/mock/` (the committed location).
"""

from __future__ import annotations

import argparse
import asyncio
import json
import random
import sys
from pathlib import Path
from typing import Any
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from artiq_http import mock_backend as mb

# Deterministic seed/clock so re-running this script (e.g. from the drift
# test) produces byte-identical output. The actual values don't matter, only
# that they're fixed.
_SEED = 20260726
_FIXED_TIME = 1_753_500_000.0  # 2025-07-26T04:40:00Z-ish; arbitrary but fixed


def slugify(file: str, class_name: str) -> str:
    """Filesystem-safe encoding of ``<file>:<class_name>`` used for arginfo
    fixture filenames. Replaces path separators in *file* with ``_`` and joins
    with *class_name* using ``__``.

    MUST exactly match the JS port in `frontend/src/api/mockAdapter.js`
    (search for `slugify` there) — both sides need to resolve the same
    experiment to the same fixture filename.
    """
    safe_file = file.replace("/", "_").replace("\\", "_")
    return f"{safe_file}__{class_name}"


def _write_json(path: Path, data: Any, *, compact: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if compact:
        text = json.dumps(data, separators=(",", ":"), allow_nan=False)
    else:
        text = json.dumps(data, indent=2, allow_nan=False)
    # Always end with a trailing newline: the repo's pre-commit `end-of-file-fixer`
    # hook enforces this on every text file, so a fixture written without one would
    # immediately drift from what's committed the moment it's swept into a commit.
    path.write_text(text + "\n", encoding="utf-8")


async def _capture_snapshot() -> dict[str, Any]:
    """Start a fresh `MockSubscriberManager` and capture its initial state.

    Everything here runs before any `await asyncio.sleep(...)`, so the
    background update loop that `start()` kicks off has not had a chance to
    run yet — the snapshot is exactly the seeded initial state.
    """
    mgr = mb.MockSubscriberManager()
    await mgr.start()
    try:
        explist_raw = mgr.get_explist()
        status = mgr.get_explist_status()
        schedule = mgr.get_schedule()
        datasets = mgr.get_datasets()
        logs = mgr.get_logs()

        # Mirror api.py's get_health(): every mock subscriber (including the
        # datasets one) reports connected, so health is unconditionally healthy.
        details = {name: sub.is_connected() for name, sub in mgr._subscribers.items()}
        connected = sum(1 for v in details.values() if v)
        total = len(details)
        if connected == total:
            health_status = "healthy"
        elif connected > 0:
            health_status = "degraded"
        else:
            health_status = "unhealthy"
        health = {
            "status": health_status,
            "artiq_connected": connected > 0,
            "details": details,
        }
    finally:
        await mgr.stop()

    return {
        "explist_raw": explist_raw,
        "status": status,
        "schedule": schedule,
        "datasets": datasets,
        "logs": logs,
        "health": health,
    }


def _build_explist_json(explist_raw: dict, status: dict) -> dict:
    """Mirror `GET /api/explist?full=true&fields=...` with every field
    requested — the adapter does its own field/full filtering client-side
    from this one full snapshot, same as `api.py`'s `_filter_experiment_fields`.
    """
    experiments = []
    for name, data in explist_raw.items():
        experiments.append(
            {
                "name": name,
                "file": data["file"],
                "class_name": data["class_name"],
                "arginfo": data.get("arginfo"),
                "argument_ui": data.get("argument_ui"),
                "scheduler_defaults": data.get("scheduler_defaults"),
                "docstring": data.get("docstring"),
            }
        )
    # config.default_revision is unset in this repo's default env, so
    # default_revision_fallback mirrors current_rev exactly like api.py does
    # when ARTIQ_HTTP_DEFAULT_REVISION is unset.
    current_rev = status.get("cur_rev", "unknown")
    return {
        "current_rev": current_rev,
        "scanning": status.get("scanning", False),
        "experiments": experiments,
        "default_revision_fallback": current_rev,
    }


def generate(out_dir: Path) -> None:
    random.seed(_SEED)
    with patch("time.time", return_value=_FIXED_TIME):
        snapshot = asyncio.run(_capture_snapshot())

    explist_raw = snapshot["explist_raw"]

    explist_json = _build_explist_json(explist_raw, snapshot["status"])
    _write_json(out_dir / "explist.json", explist_json)

    for data in explist_raw.values():
        slug = slugify(data["file"], data["class_name"])
        arginfo_doc = {
            "file": data["file"],
            "class_name": data["class_name"],
            "arginfo": data.get("arginfo") or {},
        }
        _write_json(out_dir / "arginfo" / f"{slug}.json", arginfo_doc)

    _write_json(out_dir / "schedule.json", snapshot["schedule"])

    dataset_names = {"names": list(snapshot["datasets"].keys())}
    _write_json(out_dir / "dataset_names.json", dataset_names, compact=True)

    # Datasets (incl. camera images) are the largest fixture, so keep it
    # compact (no indentation/whitespace) rather than pretty-printed.
    _write_json(out_dir / "datasets.json", snapshot["datasets"], compact=True)

    _write_json(out_dir / "logs.json", {"logs": snapshot["logs"]})
    _write_json(out_dir / "health.json", snapshot["health"])


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "frontend" / "public" / "mock",
        help="Output directory (default: frontend/public/mock)",
    )
    args = parser.parse_args()

    generate(args.out)
    print(f"Wrote mock fixtures to {args.out}")


if __name__ == "__main__":
    main()
