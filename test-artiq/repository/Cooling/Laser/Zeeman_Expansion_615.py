from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanExpansion615(EnvExperiment):
    """Dummy experiment for Zeeman Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(13, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.451210638652682, unit="s"))

    def run(self):
        print("Starting Zeeman_Expansion_615")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Expansion_615 Complete")
