from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class BellCompression734(EnvExperiment):
    """Dummy experiment for Bell Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(33, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.15651470033133927, unit="s"))

    def run(self):
        print("Starting Bell_Compression_734")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Compression_734 Complete")
