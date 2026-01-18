from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class MOTExpansion769(EnvExperiment):
    """Dummy experiment for MOT Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(75, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.593431473831684, unit="s"))

    def run(self):
        print("Starting MOT_Expansion_769")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Expansion_769 Complete")
