from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class QuadrupoleSpectroscopy989(EnvExperiment):
    """Dummy experiment for Quadrupole Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(55, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.111352989292574, unit="s"))

    def run(self):
        print("Starting Quadrupole_Spectroscopy_989")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Quadrupole_Spectroscopy_989 Complete")
