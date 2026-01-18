from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RabiCooling631(EnvExperiment):
    """Dummy experiment for Rabi Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(27, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.504835323649563, unit="s"))

    def run(self):
        print("Starting Rabi_Cooling_631")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Cooling_631 Complete")
