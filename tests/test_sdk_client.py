"""Smoke tests for the artiq_http_client SDK against a real ARTIQ server."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent / "sdk" / "src"))

from artiq_http_client import ArtiqClient
from artiq_http_client._models import ExperimentList

pytestmark = pytest.mark.realserver


def test_health():
    """ArtiqClient.health.get() returns a dict with a 'status' key."""
    with ArtiqClient(base_url="http://localhost:8000") as sdk:
        result = sdk.health.get()
    assert isinstance(result, dict)
    assert "status" in result


def test_explist():
    """ArtiqClient.explist.list() returns an ExperimentList."""
    with ArtiqClient(base_url="http://localhost:8000") as sdk:
        result = sdk.explist.list()
    assert isinstance(result, ExperimentList)
    assert isinstance(result.experiments, list)
    assert isinstance(result.scanning, bool)
