from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class BellPrep883(EnvExperiment):
    """Dummy experiment for Bell Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(10, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.77753900507344, unit="s"))

    def run(self):
        print("Starting Bell_Prep_883")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Prep_883 Complete")
