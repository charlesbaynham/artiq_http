from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class EITSpectroscopy727(EnvExperiment):
    """Dummy experiment for EIT Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(26, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.2895529542820694, unit="s"))

    def run(self):
        print("Starting EIT_Spectroscopy_727")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Spectroscopy_727 Complete")
