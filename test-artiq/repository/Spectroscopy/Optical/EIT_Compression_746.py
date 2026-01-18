from artiq.experiment import EnvExperiment, NumberValue


class EITCompression746(EnvExperiment):
    """Dummy experiment for EIT Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(54, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.298629368432618, unit="ms"))

    def run(self):
        print("Starting EIT_Compression_746")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Compression_746 Complete")
