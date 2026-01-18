from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleLoading781(EnvExperiment):
    """Dummy experiment for Dipole Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(25, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.2683777338069673, unit="s"))

    def run(self):
        print("Starting Dipole_Loading_781")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Loading_781 Complete")
