from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class QuadrupoleShift422(EnvExperiment):
    """Dummy experiment for Quadrupole Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(98, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.231267084031614, unit="s"))

    def run(self):
        print("Starting Quadrupole_Shift_422")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Quadrupole_Shift_422 Complete")
