from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineReadout838(EnvExperiment):
    """Dummy experiment for Hyperfine Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(83, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.1148517131114453, unit="s"))

    def run(self):
        print("Starting Hyperfine_Readout_838")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Readout_838 Complete")
