from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleCooling774(EnvExperiment):
    """Dummy experiment for Dipole Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(40, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.138422492032814, unit="s"))

    def run(self):
        print("Starting Dipole_Cooling_774")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Cooling_774 Complete")
