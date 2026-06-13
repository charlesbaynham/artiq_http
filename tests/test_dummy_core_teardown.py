"""Real-server regression test for the dummy-core teardown crash.

The pinned ARTIQ's ``CommKernelDummy`` has no ``close()``, so every run used to
fail at device teardown (``Core.close`` -> ``comm.close``) with
``AttributeError: 'CommKernelDummy' object has no attribute 'close'`` — reported
back as a failed run even though the experiment itself ran fine.  The fix
installs a compatibility shim into the env's site-packages (see
``test-artiq/flake.nix`` and ``test-artiq/shim/``) so it loads in both the
master and each worker process.

This test submits a minimal ndscan run and asserts it completes cleanly.  It
requires the local ARTIQ test stack (``--realserver``).
"""

import json

import pytest

pytestmark = pytest.mark.realserver


def _find_ndscan_experiment(client) -> dict:
    response = client.get("/api/explist?fields=file,class_name,arginfo&full=true")
    assert response.status_code == 200
    for experiment in response.json()["experiments"]:
        arginfo = experiment.get("arginfo") or {}
        if "ndscan_params" in arginfo and json.loads(arginfo["ndscan_params"][0]["default"]).get("schemata"):
            return experiment
    pytest.skip("No ndscan experiment available")


def test_run_completes_without_dummy_core_teardown_crash(client):
    """A no-op single run finishes as 'completed', not failed at teardown."""
    assert client.get("/api/health").json()["artiq_connected"] is True
    exp = _find_ndscan_experiment(client)

    response = client.post(
        "/api/scan",
        params={"wait_for_completion": True, "timeout": 180},
        json={"file": exp["file"], "class_name": exp["class_name"], "axes": []},
    )
    assert response.status_code == 200, response.text
    result = response.json()
    assert result["status"] == "completed", f"run did not complete cleanly: {result.get('error')}"
    assert result["error"] is None
    # The specific crash this guards against, in case the message ever changes shape.
    assert "CommKernelDummy" not in (result["error"] or "")
