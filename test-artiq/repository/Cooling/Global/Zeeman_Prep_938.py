from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanPrep938(EnvExperiment):
    """Dummy experiment for Zeeman Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(84, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.1176998512129401, unit="s"))

    def run(self):
        print("Starting Zeeman_Prep_938")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Prep_938 Complete")
