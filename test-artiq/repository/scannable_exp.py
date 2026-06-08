"""A minimal ndscan experiment with scannable parameters.

Unlike ``ndscan_exp.py`` (whose ``DummyFrag`` exposes no parameters), this
fragment defines real scannable parameters so the high-level scan-submission
API (``POST /api/scan``) can be exercised end to end against the test master.

The fragment runs entirely on the host (no core device required) and finishes
quickly, so scans submitted in the test suite complete within a few seconds.
"""

from ndscan.experiment import (
    ExpFragment,
    FloatParam,
    IntParam,
    make_fragment_scan_exp,
)
from artiq.coredevice.comm_kernel import CommKernelDummy


if not hasattr(CommKernelDummy, "close"):

    def _close(self):
        return None

    CommKernelDummy.close = _close


class ScannableFrag(ExpFragment):
    def build_fragment(self):
        # Two scannable float parameters and one non-scannable int parameter.
        self.setattr_param("frequency", FloatParam, "Frequency", 1.0, unit="MHz", min=0.0)
        self.setattr_param("amplitude", FloatParam, "Amplitude", 0.5, min=0.0)
        self.setattr_param("num_shots", IntParam, "Number of shots", 10, is_scannable=False)

        self.setattr_result("signal")

    def run_once(self):
        # Trivial, fast host-side computation so scans complete quickly.
        self.signal.push(self.frequency.get() * self.amplitude.get())


ScannableScan = make_fragment_scan_exp(ScannableFrag)
