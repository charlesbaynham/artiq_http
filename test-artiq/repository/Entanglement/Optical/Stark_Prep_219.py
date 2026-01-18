from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class StarkPrep219(EnvExperiment):
    """Dummy experiment for Stark Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(55, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.321910471579196, unit="s"))

    def run(self):
        print("Starting Stark_Prep_219")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Prep_219 Complete")
