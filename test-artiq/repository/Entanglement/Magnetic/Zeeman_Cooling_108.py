from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanCooling108(EnvExperiment):
    """Dummy experiment for Zeeman Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(5, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.456265508031054, unit="s"))

    def run(self):
        print("Starting Zeeman_Cooling_108")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Cooling_108 Complete")
