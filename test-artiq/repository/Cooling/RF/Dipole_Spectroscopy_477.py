from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleSpectroscopy477(EnvExperiment):
    """Dummy experiment for Dipole Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(8, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.3268749680860751, unit="s"))

    def run(self):
        print("Starting Dipole_Spectroscopy_477")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Spectroscopy_477 Complete")
