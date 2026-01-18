from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class EITCompression124(EnvExperiment):
    """Dummy experiment for EIT Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(4, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.243613831857166, unit="s"))

    def run(self):
        print("Starting EIT_Compression_124")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Compression_124 Complete")
