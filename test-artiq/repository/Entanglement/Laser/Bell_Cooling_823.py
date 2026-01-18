from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class BellCooling823(EnvExperiment):
    """Dummy experiment for Bell Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(38, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.6196015513555673, unit="s"))

    def run(self):
        print("Starting Bell_Cooling_823")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Cooling_823 Complete")
