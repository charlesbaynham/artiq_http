from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanShift934(EnvExperiment):
    """Dummy experiment for Zeeman Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(76, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.2352231364538342, unit="s"))

    def run(self):
        print("Starting Zeeman_Shift_934")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Shift_934 Complete")
