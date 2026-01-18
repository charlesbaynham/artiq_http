from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RabiLoading366(EnvExperiment):
    """Dummy experiment for Rabi Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(58, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.187613468552625, unit="s"))

    def run(self):
        print("Starting Rabi_Loading_366")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Loading_366 Complete")
