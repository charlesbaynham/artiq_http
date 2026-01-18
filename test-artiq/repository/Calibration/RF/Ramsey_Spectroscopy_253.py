from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseySpectroscopy253(EnvExperiment):
    """Dummy experiment for Ramsey Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(76, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.6683296554100795, unit="s"))

    def run(self):
        print("Starting Ramsey_Spectroscopy_253")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Spectroscopy_253 Complete")
