from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class StarkReadout563(EnvExperiment):
    """Dummy experiment for Stark Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(30, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.260708877282385, unit="s"))

    def run(self):
        print("Starting Stark_Readout_563")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Readout_563 Complete")
