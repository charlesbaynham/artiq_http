from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineReadout805(EnvExperiment):
    """Dummy experiment for Hyperfine Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(87, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.493034533030306, unit="s"))

    def run(self):
        print("Starting Hyperfine_Readout_805")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Readout_805 Complete")
