from artiq.experiment import EnvExperiment, NumberValue


class SidebandReadout893(EnvExperiment):
    """Dummy experiment for Sideband Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(22, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.628899470356639, unit="ms"))

    def run(self):
        print("Starting Sideband_Readout_893")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Readout_893 Complete")
