from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class BellShift391(EnvExperiment):
    """Dummy experiment for Bell Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(95, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.269508875466368, unit="s"))

    def run(self):
        print("Starting Bell_Shift_391")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Shift_391 Complete")
