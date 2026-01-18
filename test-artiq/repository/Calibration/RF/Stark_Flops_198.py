from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class StarkFlops198(EnvExperiment):
    """Dummy experiment for Stark Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(51, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.662180342817987, unit="s"))

    def run(self):
        print("Starting Stark_Flops_198")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Flops_198 Complete")
