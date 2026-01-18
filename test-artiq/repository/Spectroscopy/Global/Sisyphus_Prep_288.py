from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SisyphusPrep288(EnvExperiment):
    """Dummy experiment for Sisyphus Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(74, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.4824876095624075, unit="s"))

    def run(self):
        print("Starting Sisyphus_Prep_288")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Prep_288 Complete")
