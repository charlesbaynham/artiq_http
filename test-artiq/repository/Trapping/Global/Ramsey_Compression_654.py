from artiq.experiment import EnvExperiment, NumberValue


class RamseyCompression654(EnvExperiment):
    """Dummy experiment for Ramsey Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(79, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.2230791944144728, unit="ms"))

    def run(self):
        print("Starting Ramsey_Compression_654")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Compression_654 Complete")
