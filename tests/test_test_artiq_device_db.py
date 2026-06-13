import importlib.util
import sys
from pathlib import Path
from types import ModuleType


def _load_module_with_fake_artiq(monkeypatch, path: Path, name: str):
    """Exec the module at *path* with a minimal fake ``artiq.coredevice.comm_kernel``
    whose ``CommKernelDummy`` has no ``close`` (as the real pinned ARTIQ).

    Returns ``(module, CommKernelDummy)``.
    """
    artiq_module = ModuleType("artiq")
    artiq_module.__path__ = []
    coredevice_module = ModuleType("artiq.coredevice")
    coredevice_module.__path__ = []
    comm_kernel_module = ModuleType("artiq.coredevice.comm_kernel")

    class CommKernelDummy:
        pass

    comm_kernel_module.CommKernelDummy = CommKernelDummy

    monkeypatch.setitem(sys.modules, "artiq", artiq_module)
    monkeypatch.setitem(sys.modules, "artiq.coredevice", coredevice_module)
    monkeypatch.setitem(sys.modules, "artiq.coredevice.comm_kernel", comm_kernel_module)

    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module, CommKernelDummy


def test_shim_patches_comm_kernel_dummy_close(monkeypatch):
    """The site-packages shim gives CommKernelDummy a no-op close().

    The shim is installed onto the interpreter's path (see test-artiq/flake.nix)
    so it loads at startup in both the master and each worker process — the only
    place that fixes the worker's device-teardown crash.
    """
    shim_path = Path(__file__).resolve().parents[1] / "test-artiq" / "shim" / "artiq_dummy_core_close_shim.py"

    _, CommKernelDummy = _load_module_with_fake_artiq(monkeypatch, shim_path, "artiq_dummy_core_close_shim_under_test")

    dummy = CommKernelDummy()
    assert hasattr(dummy, "close")
    assert dummy.close() is None


def test_device_db_defines_core(monkeypatch):
    """device_db.py still defines the simulated core device."""
    device_db_path = Path(__file__).resolve().parents[1] / "test-artiq" / "device_db.py"

    module, _ = _load_module_with_fake_artiq(monkeypatch, device_db_path, "test_artiq_device_db")

    assert module.device_db["core"]["class"] == "Core"
