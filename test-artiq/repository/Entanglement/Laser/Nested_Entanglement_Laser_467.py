import time

import numpy as np
from ndscan.experiment import ExpFragment, FloatChannel, FloatParam, make_fragment_scan_exp
from ndscan.experiment.parameters import FloatParamHandle


class ReadoutFrag(ExpFragment):
    def build_fragment(self):
        self.setattr_param("threshold", FloatParam, "Threshold", 0.5, unit="V")
        self.threshold: FloatParamHandle

        self.setattr_result("counts", FloatChannel)
        self.counts: FloatChannel

    def run_once(self):
        # Simulate readout distribution
        val = np.random.normal(1.0, 0.1) if np.random.rand() > 0.5 else np.random.normal(0.0, 0.1)
        self.counts.push(val)


class NestedEntanglementLaser467Frag(ExpFragment):
    """Nested Experiment Nested_Entanglement_Laser_467

    Tests nested fragments and interactions.
    """

    def build_fragment(self):
        self.setattr_fragment("readout", ReadoutFrag)
        self.readout: ReadoutFrag

        self.setattr_param("frequency", FloatParam, "Rabi Frequency", 10e6, unit="MHz")
        self.frequency: FloatParamHandle

        self.setattr_param("duration", FloatParam, "Pulse Duration", 10e-6, unit="us")
        self.duration: FloatParamHandle

    def run_once(self):
        time.sleep(0.3)
        # In a real experiment, we'd use frequency/duration here
        # f = self.frequency.get()
        # t = self.duration.get()

        # Execute subfragment
        self.readout.run_once()


NestedEntanglementLaser467 = make_fragment_scan_exp(NestedEntanglementLaser467Frag)
