from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SisyphusExcitation595(EnvExperiment):
    """Dummy experiment for Sisyphus Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(2, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.183097513273039, unit="s"))

    def run(self):
        print("Starting Sisyphus_Excitation_595")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Excitation_595 Complete")
