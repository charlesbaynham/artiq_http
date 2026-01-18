from artiq.experiment import EnvExperiment, NumberValue


class STIRAPReadout688(EnvExperiment):
    """Dummy experiment for STIRAP Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(85, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.570552979942763, unit="ms"))

    def run(self):
        print("Starting STIRAP_Readout_688")
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Readout_688 Complete")
