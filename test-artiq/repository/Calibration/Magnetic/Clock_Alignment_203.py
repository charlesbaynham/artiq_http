from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ClockAlignment203(EnvExperiment):
    """Dummy experiment for Clock Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(13, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.18031965571956426, unit="s"))

    def run(self):
        print("Starting Clock_Alignment_203")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Clock_Alignment_203 Complete")
