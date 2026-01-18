from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class StarkCooling991(EnvExperiment):
    """Dummy experiment for Stark Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(28, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.088671870550868, unit="s"))

    def run(self):
        print("Starting Stark_Cooling_991")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Cooling_991 Complete")
