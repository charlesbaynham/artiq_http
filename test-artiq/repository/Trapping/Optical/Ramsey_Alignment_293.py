from artiq.experiment import EnvExperiment, NumberValue


class RamseyAlignment293(EnvExperiment):
    """Dummy experiment for Ramsey Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(25, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.217770013421011, unit="ms"))

    def run(self):
        print("Starting Ramsey_Alignment_293")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Alignment_293 Complete")
