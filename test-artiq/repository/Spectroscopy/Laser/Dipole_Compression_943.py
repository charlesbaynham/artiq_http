from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleCompression943(EnvExperiment):
    """Dummy experiment for Dipole Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(74, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.173656488542971, unit="s"))

    def run(self):
        print("Starting Dipole_Compression_943")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Compression_943 Complete")
