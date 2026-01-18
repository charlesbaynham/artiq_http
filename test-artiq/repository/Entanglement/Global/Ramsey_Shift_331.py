from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseyShift331(EnvExperiment):
    """Dummy experiment for Ramsey Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(47, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.040352638772625, unit="s"))

    def run(self):
        print("Starting Ramsey_Shift_331")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Shift_331 Complete")
