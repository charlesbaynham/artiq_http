# device_db.py
from artiq.coredevice.comm_kernel import CommKernelDummy

if not hasattr(CommKernelDummy, "close"):

    def _close(self):
        return None

    CommKernelDummy.close = _close


device_db = {
    "core": {
        "type": "local",
        "module": "artiq.coredevice.core",
        "class": "Core",
        "arguments": {"host": None, "ref_period": 1e-9},
    },
    "core_log": {
        "type": "local",
        "module": "artiq.coredevice.core",
        "class": "CoreLog",
        "arguments": {"core_device": "core"},
    },
    "core_cache": {
        "type": "local",
        "module": "artiq.coredevice.cache",
        "class": "CoreCache",
        "arguments": {"core_device": "core"},
    },
}
