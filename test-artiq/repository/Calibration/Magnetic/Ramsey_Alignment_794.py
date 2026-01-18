from artiq.experiment import EnvExperiment, NumberValue


class RamseyAlignment794(EnvExperiment):
    """Dummy experiment for Ramsey Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(51, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.3449796157060991, unit="ms"))

    def run(self):
        print("Starting Ramsey_Alignment_794")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Alignment_794 Complete")
