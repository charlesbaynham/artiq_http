"""Test-stack compatibility shim for ARTIQ's dummy core device.

The pinned ARTIQ's ``artiq.coredevice.comm_kernel.CommKernelDummy`` (used by the
simulated ``core`` device, which has ``host=None``) defines ``load``/``run``/
``serve``/``check_system_info`` but **no** ``close``.  At the end of every run
the worker tears devices down via ``DeviceManager.close_devices`` ->
``Core.close`` -> ``self.comm.close``, which therefore raises
``AttributeError: 'CommKernelDummy' object has no attribute 'close'`` and marks
the run as failed.

This module gives ``CommKernelDummy`` a no-op ``close``.  It is loaded at
interpreter startup in *every* process of the test stack (master and each
experiment worker) via a ``.pth`` file installed alongside it on
``sys.path`` — see ``flake.nix``.  A per-process startup hook is required
because the worker builds its devices over IPC (``ParentDeviceDB``) and never
executes ``device_db.py``, so patching there would only cover the master.

Guarded so it is a silent no-op on any ARTIQ version that already provides
``close`` (or if the import is unavailable for any reason).
"""

try:
    from artiq.coredevice.comm_kernel import CommKernelDummy
except Exception:  # pragma: no cover - defensive: never break interpreter startup
    pass
else:
    if not hasattr(CommKernelDummy, "close"):

        def _close(self):  # noqa: ANN001, ANN202 - matches the real close() signature
            return None

        CommKernelDummy.close = _close
