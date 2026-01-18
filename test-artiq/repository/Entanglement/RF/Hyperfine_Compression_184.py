from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineCompression184(EnvExperiment):
    """Dummy experiment for Hyperfine Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(55, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.295650642944435, unit="s"))

    def run(self):
        print("Starting Hyperfine_Compression_184")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Compression_184 Complete")
