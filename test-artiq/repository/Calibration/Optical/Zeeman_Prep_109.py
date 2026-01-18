from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanPrep109(EnvExperiment):
    """Dummy experiment for Zeeman Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(49, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.289130651601509, unit="s"))

    def run(self):
        print("Starting Zeeman_Prep_109")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Prep_109 Complete")
