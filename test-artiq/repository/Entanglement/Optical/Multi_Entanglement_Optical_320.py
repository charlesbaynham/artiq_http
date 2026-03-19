import numpy as np
from ndscan.experiment import ExpFragment, FloatChannel, FloatParam, make_fragment_scan_exp
from ndscan.experiment.parameters import FloatParamHandle


class MultiEntanglementOptical320Frag(ExpFragment):
    """Multi-channel Experiment Multi_Entanglement_Optical_320

    Tests experiments with multiple result channels.
    """

    def build_fragment(self):
        self.setattr_param("x_val", FloatParam, "X Value", 0.0, unit="V")
        self.x_val: FloatParamHandle

        self.setattr_result("ch1_raw", FloatChannel)
        self.ch1_raw: FloatChannel

        self.setattr_result("ch2_proc", FloatChannel)
        self.ch2_proc: FloatChannel

    def run_once(self):
        x = self.x_val.get()

        v1 = np.sin(x) + np.random.normal(0, 0.05)
        v2 = v1**2

        self.ch1_raw.push(v1)
        self.ch2_proc.push(v2)


MultiEntanglementOptical320 = make_fragment_scan_exp(MultiEntanglementOptical320Frag)
