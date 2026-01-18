from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPCompression550(EnvExperiment):
    """Dummy experiment for STIRAP Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(18, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.5940720364144798, unit="s"))

    def run(self):
        print("Starting STIRAP_Compression_550")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Compression_550 Complete")
