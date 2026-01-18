from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class EITFlops752(EnvExperiment):
    """Dummy experiment for EIT Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(62, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.8418961701058247, unit="s"))

    def run(self):
        print("Starting EIT_Flops_752")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Flops_752 Complete")
