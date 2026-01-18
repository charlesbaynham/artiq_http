from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleLoading693(EnvExperiment):
    """Dummy experiment for Dipole Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(86, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.239888283601989, unit="s"))

    def run(self):
        print("Starting Dipole_Loading_693")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Loading_693 Complete")
