# device_db.py
#
# Note: the CommKernelDummy.close() compatibility shim that previously lived
# here is now installed into the env's site-packages (see flake.nix /
# shim/artiq_dummy_core_close_shim.py) so it also applies in the worker
# process, which builds devices over IPC and never executes this file.
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
