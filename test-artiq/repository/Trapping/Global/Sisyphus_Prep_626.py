from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SisyphusPrep626(EnvExperiment):
    """Dummy experiment for Sisyphus Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(85, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.796635451361606, unit="s"))

    def run(self):
        print("Starting Sisyphus_Prep_626")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Prep_626 Complete")
