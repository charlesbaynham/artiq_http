from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SisyphusCompression605(EnvExperiment):
    """Dummy experiment for Sisyphus Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(56, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.1962567457584585, unit="s"))

    def run(self):
        print("Starting Sisyphus_Compression_605")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Compression_605 Complete")
