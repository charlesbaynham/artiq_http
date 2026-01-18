from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SidebandExcitation644(EnvExperiment):
    """Dummy experiment for Sideband Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(57, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.386894568751794, unit="s"))

    def run(self):
        print("Starting Sideband_Excitation_644")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Excitation_644 Complete")
