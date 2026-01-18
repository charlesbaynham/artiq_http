from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SisyphusReadout124(EnvExperiment):
    """Dummy experiment for Sisyphus Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(17, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.412017203183655, unit="s"))

    def run(self):
        print("Starting Sisyphus_Readout_124")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Readout_124 Complete")
