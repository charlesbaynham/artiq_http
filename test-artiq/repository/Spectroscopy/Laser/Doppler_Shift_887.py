from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DopplerShift887(EnvExperiment):
    """Dummy experiment for Doppler Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(14, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.7315708617455534, unit="s"))

    def run(self):
        print("Starting Doppler_Shift_887")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Shift_887 Complete")
