from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class MOTAlignment212(EnvExperiment):
    """Dummy experiment for MOT Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(8, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.1205639823648967, unit="s"))

    def run(self):
        print("Starting MOT_Alignment_212")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Alignment_212 Complete")
