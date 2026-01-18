from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class MOTAlignment685(EnvExperiment):
    """Dummy experiment for MOT Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(42, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.510346148121623, unit="s"))

    def run(self):
        print("Starting MOT_Alignment_685")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Alignment_685 Complete")
