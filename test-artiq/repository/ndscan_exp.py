from artiq.experiment import *  # noqa: F401, F403, F405
from ndscan.experiment import *  # noqa: F401, F403, F405
import numpy as np


class NDScanExample(ExpFragment):
    """NDScan Example Fragment

    A fragment that demonstrates ndscan parameters and results.
    """

    def build_fragment(self):
        self.setattr_param("amplitude", FloatParam(1.0, min=0.0, max=1.0))
        self.setattr_param("frequency", FloatParam(100.0, unit="MHz"))
        self.setattr_param("phase", FloatParam(0.0))

        # Results are usually just names in ndscan, but here we can hint at types
        self.setattr_result("signal")

    def run_once(self):
        # Simulate a signal based on parameters
        # We use a simple model: amplitude * sin(phase) + noise
        amp = self.get_param("amplitude")
        phase = self.get_param("phase")

        sig = float(amp * np.sin(phase) + np.random.normal(0, 0.1))
        self.set_result("signal", sig)
        print(f"Measured signal: {sig:.4f}")


class NDScanExp(Experiment):
    """NDScan Experiment

    An experiment that wraps the NDScanExample fragment.
    This demonstrates how ndscan fragments are exposed as experiments.
    """

    def build(self):
        self.setattr_fragment("scan_fragment", NDScanExample)

    def run(self):
        print("Starting NDScan Experiment")
        self.scan_fragment.run_once()
        print("NDScan Experiment Complete")
