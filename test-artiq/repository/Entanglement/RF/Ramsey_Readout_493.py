from artiq.experiment import EnvExperiment, NumberValue


class RamseyReadout493(EnvExperiment):
    """Dummy experiment for Ramsey Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(49, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.362263410898468, unit="ms"))

    def run(self):
        print("Starting Ramsey_Readout_493")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Readout_493 Complete")
