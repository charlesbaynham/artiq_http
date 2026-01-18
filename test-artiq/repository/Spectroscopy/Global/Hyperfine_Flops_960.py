from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineFlops960(EnvExperiment):
    """Dummy experiment for Hyperfine Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(53, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.680274776119167, unit="s"))

    def run(self):
        print("Starting Hyperfine_Flops_960")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Flops_960 Complete")
