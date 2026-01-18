from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SidebandExpansion925(EnvExperiment):
    """Dummy experiment for Sideband Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(59, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.716483488712607, unit="s"))

    def run(self):
        print("Starting Sideband_Expansion_925")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Expansion_925 Complete")
