import time

import numpy as np
from ndscan.experiment import BoolParam, ExpFragment, FloatChannel, FloatParam, IntParam, make_fragment_scan_exp
from ndscan.experiment.parameters import BoolParamHandle, FloatParamHandle, IntParamHandle


class BasicTrappingGlobal569Frag(ExpFragment):
    """Basic NDScan Experiment Basic_Trapping_Global_569

    Tests basic parameter types and single result channel.
    """

    def build_fragment(self):
        self.setattr_param("frequency", FloatParam, "Frequency", 100e6, unit="MHz", min=0.0)
        self.frequency: FloatParamHandle

        self.setattr_param("amplitude", FloatParam, "Amplitude", 0.5, unit="V", min=0.0, max=1.0)
        self.amplitude: FloatParamHandle

        self.setattr_param("count", IntParam, "Count", 10, min=1)
        self.count: IntParamHandle

        self.setattr_param("enable_noise", BoolParam, "Enable Noise", default=True)
        self.enable_noise: BoolParamHandle

        self.setattr_result("signal", FloatChannel)
        self.signal: FloatChannel

    def run_once(self):
        time.sleep(100)
        f = self.frequency.get()
        a = self.amplitude.get()
        noise_on = self.enable_noise.get()

        # Simulate result
        val = a * np.sin(2 * np.pi * (f / 1e8))
        if noise_on:
            val += np.random.normal(0, 0.1)

        self.signal.push(val)


BasicTrappingGlobal569 = make_fragment_scan_exp(BasicTrappingGlobal569Frag)
