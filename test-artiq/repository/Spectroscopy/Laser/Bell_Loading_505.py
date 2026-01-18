from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class BellLoading505(EnvExperiment):
    """Dummy experiment for Bell Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(87, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.458363553578367, unit="s"))

    def run(self):
        print("Starting Bell_Loading_505")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Loading_505 Complete")
