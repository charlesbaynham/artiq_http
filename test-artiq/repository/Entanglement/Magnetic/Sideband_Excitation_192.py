from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SidebandExcitation192(EnvExperiment):
    """Dummy experiment for Sideband Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(82, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.592921973262895, unit="s"))

    def run(self):
        print("Starting Sideband_Excitation_192")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Excitation_192 Complete")
