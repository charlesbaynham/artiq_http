import numpy as np
from ndscan.experiment import ExpFragment, FloatChannel, FloatParam, make_fragment_scan_exp
from ndscan.experiment.parameters import FloatParamHandle


class NDScanExampleFrag(ExpFragment):
    """NDScan Example Fragment

    A fragment that demonstrates ndscan parameters and results.
    """

    def build_fragment(self):
        self.setattr_param("amplitude", FloatParam, "Amplitude of the signal", 1.0, min=0.0, max=1.0)
        self.setattr_param("phase", FloatParam, "Phase of the signal", 0.0, min=0.0, max=2 * np.pi)
        self.setattr_param("noise", FloatParam, "Noise level of the signal", 0.1, min=0.0)

        self.amplitude: FloatParamHandle
        self.phase: FloatParamHandle
        self.noise: FloatParamHandle

        self.setattr_result("signal", FloatChannel, description="Signal measured by the experiment")
        self.signal: FloatChannel

    def run_once(self):
        amp = self.amplitude.get()
        phase = self.phase.get()
        noise = self.noise.get()
        sig = float(amp * np.sin(phase) + np.random.normal(0, noise))

        self.signal.push(sig)
        print(f"Measured signal: {sig:.4f}")


NDScanExampleExp = make_fragment_scan_exp(NDScanExampleFrag)
