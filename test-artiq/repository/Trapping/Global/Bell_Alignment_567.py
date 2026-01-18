from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class BellAlignment567(EnvExperiment):
    """Dummy experiment for Bell Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(60, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.484630703054904, unit="s"))

    def run(self):
        print("Starting Bell_Alignment_567")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Alignment_567 Complete")
