from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DopplerPrep101(EnvExperiment):
    """Dummy experiment for Doppler Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(41, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.2112769174375716, unit="s"))

    def run(self):
        print("Starting Doppler_Prep_101")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Prep_101 Complete")
