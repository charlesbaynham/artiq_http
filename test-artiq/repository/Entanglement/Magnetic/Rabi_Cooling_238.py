from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RabiCooling238(EnvExperiment):
    """Dummy experiment for Rabi Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(50, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.870203648072142, unit="s"))

    def run(self):
        print("Starting Rabi_Cooling_238")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Cooling_238 Complete")
