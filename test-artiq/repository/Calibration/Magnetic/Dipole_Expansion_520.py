from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleExpansion520(EnvExperiment):
    """Dummy experiment for Dipole Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(34, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.991004595441292, unit="s"))

    def run(self):
        print("Starting Dipole_Expansion_520")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Expansion_520 Complete")
