from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SisyphusPrep755(EnvExperiment):
    """Dummy experiment for Sisyphus Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(77, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.718430585295108, unit="s"))

    def run(self):
        print("Starting Sisyphus_Prep_755")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Prep_755 Complete")
