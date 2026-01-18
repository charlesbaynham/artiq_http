from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseyShift167(EnvExperiment):
    """Dummy experiment for Ramsey Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(48, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.2928879596963108, unit="s"))

    def run(self):
        print("Starting Ramsey_Shift_167")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Shift_167 Complete")
