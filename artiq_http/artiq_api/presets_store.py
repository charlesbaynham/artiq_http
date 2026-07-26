"""Async-safe JSON-file-backed store for scan/session presets and favourites.

There is no database and no auth/user concept in this project — presets are a
lab-wide convenience persisted to a single JSON file on the backend host. The
whole file is read, modified, and rewritten atomically (temp file + os.replace)
under an `asyncio.Lock`, which is more than adequate for the tiny, infrequent
read/write volume a preset list sees.

The file path is read from ``config["presets_file"]`` on every call (not cached)
so tests can monkeypatch it per-test. A missing file starts from an empty list;
a corrupt or unexpectedly-shaped file logs a warning and also starts empty —
this store must never raise out of the API for a bad presets file.
"""

from __future__ import annotations

import json
import logging
import os
import tempfile
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from ..config import config

logger = logging.getLogger(__name__)

# Guards read-modify-write cycles against concurrent requests. A single process
# handles the presets file, so one lock for the whole store is sufficient.
_lock_holder: Dict[str, Any] = {}


def _get_lock():
    """Lazily create the asyncio.Lock the first time it's needed.

    Deferred so importing this module never requires a running event loop
    (module import happens well before uvicorn starts one).
    """
    import asyncio

    lock = _lock_holder.get("lock")
    if lock is None:
        lock = asyncio.Lock()
        _lock_holder["lock"] = lock
    return lock


def _presets_path() -> Path:
    return Path(config["presets_file"]).expanduser()


def _read_all() -> List[Dict[str, Any]]:
    """Read every preset from disk. Never raises — tolerates a missing or
    corrupt file by returning an empty list (and logging a warning)."""
    path = _presets_path()
    if not path.exists():
        return []
    try:
        with open(path, "r") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        logger.warning("Presets file %s is missing/corrupt (%s); starting empty", path, e)
        return []

    if not isinstance(data, dict) or not isinstance(data.get("presets"), list):
        logger.warning("Presets file %s has an unexpected shape; starting empty", path)
        return []
    return [p for p in data["presets"] if isinstance(p, dict)]


def _write_all(presets: List[Dict[str, Any]]) -> None:
    """Atomically overwrite the presets file with *presets*."""
    path = _presets_path()
    path.parent.mkdir(parents=True, exist_ok=True)

    fd, tmp_name = tempfile.mkstemp(dir=str(path.parent), prefix=".presets-", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump({"presets": presets}, f, indent=2)
        os.replace(tmp_name, path)
    except BaseException:
        try:
            os.unlink(tmp_name)
        except OSError:
            pass
        raise


async def list_presets(
    file: Optional[str] = None,
    class_name: Optional[str] = None,
    favourites_only: bool = False,
) -> List[Dict[str, Any]]:
    """Return presets, optionally filtered by *file*, *class_name*, and/or
    *favourites_only*. Filters are ANDed together."""
    async with _get_lock():
        presets = _read_all()
    if file is not None:
        presets = [p for p in presets if p.get("file") == file]
    if class_name is not None:
        presets = [p for p in presets if p.get("class_name") == class_name]
    if favourites_only:
        presets = [p for p in presets if p.get("favourite")]
    return presets


async def create_preset(data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new preset from *data* (no ``id``/timestamps expected). The
    server generates ``id`` (uuid4 hex) and ``created_at``/``updated_at``
    (``time.time()``)."""
    now = time.time()
    preset = dict(data)
    preset["id"] = uuid.uuid4().hex
    preset["created_at"] = now
    preset["updated_at"] = now

    async with _get_lock():
        presets = _read_all()
        presets.append(preset)
        _write_all(presets)
    return preset


async def update_preset(preset_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Replace the preset identified by *preset_id* with *data*, preserving its
    ``id`` and ``created_at`` and refreshing ``updated_at``. Returns the updated
    preset, or ``None`` if *preset_id* does not exist."""
    async with _get_lock():
        presets = _read_all()
        for i, existing in enumerate(presets):
            if existing.get("id") == preset_id:
                updated = dict(data)
                updated["id"] = preset_id
                updated["created_at"] = existing.get("created_at", time.time())
                updated["updated_at"] = time.time()
                presets[i] = updated
                _write_all(presets)
                return updated
    return None


async def delete_preset(preset_id: str) -> bool:
    """Delete the preset identified by *preset_id*. Returns True if a preset
    was removed, False if no preset with that id existed."""
    async with _get_lock():
        presets = _read_all()
        remaining = [p for p in presets if p.get("id") != preset_id]
        if len(remaining) == len(presets):
            return False
        _write_all(remaining)
    return True
