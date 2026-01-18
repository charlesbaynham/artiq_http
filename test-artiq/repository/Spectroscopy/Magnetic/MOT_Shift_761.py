from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class MOTShift761(EnvExperiment):
    """Dummy experiment for MOT Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(51, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.109695387973407, unit="s"))

    def run(self):
        print("Starting MOT_Shift_761")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Shift_761 Complete")
