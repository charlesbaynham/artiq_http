from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class EITExcitation873(EnvExperiment):
    """Dummy experiment for EIT Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(84, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.189129158398115, unit="s"))

    def run(self):
        print("Starting EIT_Excitation_873")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Excitation_873 Complete")
