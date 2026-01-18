from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseyCompression666(EnvExperiment):
    """Dummy experiment for Ramsey Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(42, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.21594982504646, unit="s"))

    def run(self):
        print("Starting Ramsey_Compression_666")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Compression_666 Complete")
