from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class StarkCompression782(EnvExperiment):
    """Dummy experiment for Stark Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(98, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.420339976809763, unit="s"))

    def run(self):
        print("Starting Stark_Compression_782")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Compression_782 Complete")
