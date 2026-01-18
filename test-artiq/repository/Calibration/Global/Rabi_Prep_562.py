from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RabiPrep562(EnvExperiment):
    """Dummy experiment for Rabi Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(3, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.160720824279079, unit="s"))

    def run(self):
        print("Starting Rabi_Prep_562")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Prep_562 Complete")
