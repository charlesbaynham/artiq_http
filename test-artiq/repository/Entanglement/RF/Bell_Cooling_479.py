from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class BellCooling479(EnvExperiment):
    """Dummy experiment for Bell Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(92, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.8219227129622577, unit="s"))

    def run(self):
        print("Starting Bell_Cooling_479")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Cooling_479 Complete")
