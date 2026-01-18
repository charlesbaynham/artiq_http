from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class MOTSpectroscopy381(EnvExperiment):
    """Dummy experiment for MOT Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(82, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.931085525454256, unit="s"))

    def run(self):
        print("Starting MOT_Spectroscopy_381")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Spectroscopy_381 Complete")
