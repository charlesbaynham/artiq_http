from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class StarkExpansion946(EnvExperiment):
    """Dummy experiment for Stark Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(73, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.111741172746352, unit="s"))

    def run(self):
        print("Starting Stark_Expansion_946")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Expansion_946 Complete")
