from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class EITCooling380(EnvExperiment):
    """Dummy experiment for EIT Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(39, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.687006293435976, unit="s"))

    def run(self):
        print("Starting EIT_Cooling_380")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Cooling_380 Complete")
