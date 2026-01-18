from artiq.experiment import EnvExperiment, NumberValue


class RamseyReadout105(EnvExperiment):
    """Dummy experiment for Ramsey Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(14, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.123152210612744, unit="ms"))

    def run(self):
        print("Starting Ramsey_Readout_105")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Readout_105 Complete")
