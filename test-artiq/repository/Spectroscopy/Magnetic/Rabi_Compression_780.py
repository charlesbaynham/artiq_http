from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RabiCompression780(EnvExperiment):
    """Dummy experiment for Rabi Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(77, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.8862112984409695, unit="s"))

    def run(self):
        print("Starting Rabi_Compression_780")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Compression_780 Complete")
