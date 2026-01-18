from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanFlops205(EnvExperiment):
    """Dummy experiment for Zeeman Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(9, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.9193009544680733, unit="s"))

    def run(self):
        print("Starting Zeeman_Flops_205")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Flops_205 Complete")
