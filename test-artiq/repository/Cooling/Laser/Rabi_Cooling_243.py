from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RabiCooling243(EnvExperiment):
    """Dummy experiment for Rabi Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(33, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.624044970867394, unit="s"))

    def run(self):
        print("Starting Rabi_Cooling_243")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Cooling_243 Complete")
