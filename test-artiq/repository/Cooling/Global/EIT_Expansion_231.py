from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class EITExpansion231(EnvExperiment):
    """Dummy experiment for EIT Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(61, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.5866598178068623, unit="s"))

    def run(self):
        print("Starting EIT_Expansion_231")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Expansion_231 Complete")
