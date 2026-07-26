"""Tests for the presets store (artiq_http/artiq_api/presets_store.py) and the
GET/POST/PUT/DELETE /api/presets routes.

Presets are lab-wide and not ARTIQ-dependent, so these tests exercise the
FastAPI routes directly with a tmp_path-backed presets file — no mock backend
or lifespan startup needed (the presets routes never touch subscriber_manager).
"""

import asyncio
import json

import pytest
from fastapi.testclient import TestClient

from artiq_http.api import app
from artiq_http.config import config

client = TestClient(app)


@pytest.fixture(autouse=True)
def presets_file(tmp_path, monkeypatch):
    """Point config["presets_file"] at a fresh tmp_path file for every test."""
    path = tmp_path / "presets.json"
    monkeypatch.setitem(config, "presets_file", str(path))
    return path


def _preset_body(**overrides):
    body = {
        "name": "quick check",
        "file": "Spectroscopy/rabi_flop.py",
        "class_name": "RabiFlop",
        "favourite": False,
        "working_set": [{"fqn": "rabi.pulse_duration", "mode": "fixed", "value": 1e-5}],
        "pipeline": "main",
        "priority": 0,
        "repeats": 1,
        "skip_on_error": False,
        "revision": None,
    }
    body.update(overrides)
    return body


# ---------------------------------------------------------------------------
# presets_store unit tests
# ---------------------------------------------------------------------------


def test_store_missing_file_starts_empty(presets_file):
    from artiq_http.artiq_api import presets_store

    assert asyncio.run(presets_store.list_presets()) == []


def test_store_corrupt_file_starts_empty_and_logs(presets_file, caplog):
    presets_file.parent.mkdir(parents=True, exist_ok=True)
    presets_file.write_text("{not valid json")

    from artiq_http.artiq_api import presets_store

    with caplog.at_level("WARNING"):
        result = asyncio.run(presets_store.list_presets())
    assert result == []
    assert any("corrupt" in rec.message.lower() or "missing" in rec.message.lower() for rec in caplog.records)


def test_store_unexpected_shape_starts_empty(presets_file):
    presets_file.parent.mkdir(parents=True, exist_ok=True)
    presets_file.write_text(json.dumps({"not_presets": []}))

    from artiq_http.artiq_api import presets_store

    assert asyncio.run(presets_store.list_presets()) == []


def test_store_create_persists_atomically(presets_file):
    from artiq_http.artiq_api import presets_store

    created = asyncio.run(presets_store.create_preset(_preset_body()))
    assert created["id"]
    assert created["created_at"] == created["updated_at"]
    assert presets_file.exists()

    on_disk = json.loads(presets_file.read_text())
    assert len(on_disk["presets"]) == 1
    assert on_disk["presets"][0]["id"] == created["id"]


def test_store_creates_parent_directories(tmp_path, monkeypatch):
    from artiq_http.artiq_api import presets_store

    nested = tmp_path / "nested" / "dir" / "presets.json"
    monkeypatch.setitem(config, "presets_file", str(nested))

    asyncio.run(presets_store.create_preset(_preset_body()))
    assert nested.exists()


# ---------------------------------------------------------------------------
# HTTP route CRUD round-trip
# ---------------------------------------------------------------------------


def test_get_presets_empty_by_default():
    r = client.get("/api/presets")
    assert r.status_code == 200
    assert r.json() == {"presets": []}


def test_create_then_get_preset():
    r = client.post("/api/presets", json=_preset_body())
    assert r.status_code == 200
    created = r.json()
    assert created["name"] == "quick check"
    assert created["file"] == "Spectroscopy/rabi_flop.py"
    assert created["id"]
    assert created["created_at"] > 0
    assert created["updated_at"] == created["created_at"]
    # working_set is opaque passthrough
    assert created["working_set"] == [{"fqn": "rabi.pulse_duration", "mode": "fixed", "value": 1e-5}]

    r = client.get("/api/presets")
    assert r.status_code == 200
    presets = r.json()["presets"]
    assert len(presets) == 1
    assert presets[0]["id"] == created["id"]


def test_update_preset_round_trip():
    created = client.post("/api/presets", json=_preset_body()).json()

    updated_body = _preset_body(name="renamed", favourite=True, priority=5)
    r = client.put(f"/api/presets/{created['id']}", json=updated_body)
    assert r.status_code == 200
    updated = r.json()
    assert updated["id"] == created["id"]
    assert updated["name"] == "renamed"
    assert updated["favourite"] is True
    assert updated["priority"] == 5
    assert updated["created_at"] == created["created_at"]
    assert updated["updated_at"] >= created["updated_at"]


def test_update_missing_preset_returns_404():
    r = client.put("/api/presets/does-not-exist", json=_preset_body())
    assert r.status_code == 404


def test_delete_preset_round_trip():
    created = client.post("/api/presets", json=_preset_body()).json()

    r = client.delete(f"/api/presets/{created['id']}")
    assert r.status_code == 200

    r = client.get("/api/presets")
    assert r.json()["presets"] == []


def test_delete_missing_preset_returns_404():
    r = client.delete("/api/presets/does-not-exist")
    assert r.status_code == 404


def test_filters_by_file_class_name_and_favourites():
    client.post("/api/presets", json=_preset_body(name="a", file="a.py", class_name="A", favourite=True))
    client.post("/api/presets", json=_preset_body(name="b", file="b.py", class_name="B", favourite=False))
    client.post("/api/presets", json=_preset_body(name="c", file="a.py", class_name="A", favourite=False))

    r = client.get("/api/presets", params={"file": "a.py"})
    names = {p["name"] for p in r.json()["presets"]}
    assert names == {"a", "c"}

    r = client.get("/api/presets", params={"class_name": "B"})
    names = {p["name"] for p in r.json()["presets"]}
    assert names == {"b"}

    r = client.get("/api/presets", params={"favourites_only": True})
    names = {p["name"] for p in r.json()["presets"]}
    assert names == {"a"}


def test_corrupt_presets_file_tolerated_by_route(presets_file):
    """A corrupt presets file must not 500 the API — it degrades to an empty list."""
    presets_file.parent.mkdir(parents=True, exist_ok=True)
    presets_file.write_text("not json at all")

    r = client.get("/api/presets")
    assert r.status_code == 200
    assert r.json() == {"presets": []}
