from artiq.experiment import EnvExperiment, NumberValue


class RamseyLoading485(EnvExperiment):
    """Dummy experiment for Ramsey Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(47, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.4901014877731993, unit="ms"))

    def run(self):
        print("Starting Ramsey_Loading_485")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Loading_485 Complete")
