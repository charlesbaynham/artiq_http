from artiq.experiment import EnvExperiment
from ndscan.experiment import ExpFragment, FloatParam
import numpy as np

class NDScanExample(ExpFragment):
    """NDScan Example Fragment
    
    A fragment that demonstrates ndscan parameters and results.
    """
    def build_fragment(self):
        self.setattr_param("amplitude", FloatParam(1.0, min=0.0, max=1.0))
        self.setattr_param("phase", FloatParam(0.0))
        self.setattr_result("signal")

    def run_once(self):
        amp = self.get_param("amplitude")
        phase = self.get_param("phase")
        sig = float(amp * np.sin(phase) + np.random.normal(0, 0.1))
        self.set_result("signal", sig)
        print(f"Measured signal: {sig:.4f}")

class NDScanExp(EnvExperiment):
    """NDScan Experiment
    
    An experiment that wraps the NDScanExample fragment using standard ARTIQ 
    initialization pattern.
    """
    def build(self):
        # Initialize the fragment with 'self' as the parent
        self.scan_fragment = NDScanExample(self)

    def run(self):
        print("Starting NDScan Experiment")
        self.scan_fragment.run_once()
        print("NDScan Experiment Complete")
