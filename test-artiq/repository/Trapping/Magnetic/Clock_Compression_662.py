from artiq.experiment import EnvExperiment, NumberValue


class ClockCompression662(EnvExperiment):
    """Dummy experiment for Clock Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(67, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.6172890806893973, unit="ms"))

    def run(self):
        print("Starting Clock_Compression_662")
        self.set_dataset("results", self.count, broadcast=True)
        print("Clock_Compression_662 Complete")
