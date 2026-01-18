from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPSpectroscopy575(EnvExperiment):
    """Dummy experiment for STIRAP Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(16, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.0935490932931007, unit="s"))

    def run(self):
        print("Starting STIRAP_Spectroscopy_575")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Spectroscopy_575 Complete")
