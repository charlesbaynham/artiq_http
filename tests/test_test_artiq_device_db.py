import importlib.util
import sys
from pathlib import Path
from types import ModuleType


def test_device_db_patches_comm_kernel_dummy_close(monkeypatch):
    device_db_path = Path(__file__).resolve().parents[1] / "test-artiq" / "device_db.py"

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

    spec = importlib.util.spec_from_file_location("test_artiq_device_db", device_db_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)

    dummy = CommKernelDummy()
    assert hasattr(dummy, "close")
    assert dummy.close() is None
    assert module.device_db["core"]["class"] == "Core"
