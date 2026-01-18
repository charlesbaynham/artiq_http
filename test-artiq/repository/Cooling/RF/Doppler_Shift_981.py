from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DopplerShift981(EnvExperiment):
    """Dummy experiment for Doppler Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(56, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.9968293955269196, unit="s"))

    def run(self):
        print("Starting Doppler_Shift_981")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Shift_981 Complete")
