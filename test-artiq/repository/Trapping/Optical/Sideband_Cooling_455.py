from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SidebandCooling455(EnvExperiment):
    """Dummy experiment for Sideband Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(67, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.36695952565798, unit="s"))

    def run(self):
        print("Starting Sideband_Cooling_455")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Cooling_455 Complete")
