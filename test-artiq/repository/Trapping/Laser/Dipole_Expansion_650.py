from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleExpansion650(EnvExperiment):
    """Dummy experiment for Dipole Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(49, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.9457414374783637, unit="s"))

    def run(self):
        print("Starting Dipole_Expansion_650")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Expansion_650 Complete")
