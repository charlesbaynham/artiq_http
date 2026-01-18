from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineLoading110(EnvExperiment):
    """Dummy experiment for Hyperfine Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(5, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.0550130580885493, unit="s"))

    def run(self):
        print("Starting Hyperfine_Loading_110")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Loading_110 Complete")
