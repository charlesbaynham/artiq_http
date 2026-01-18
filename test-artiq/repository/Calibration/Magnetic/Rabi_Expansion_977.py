from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RabiExpansion977(EnvExperiment):
    """Dummy experiment for Rabi Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(47, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.71552203143198, unit="s"))

    def run(self):
        print("Starting Rabi_Expansion_977")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Expansion_977 Complete")
