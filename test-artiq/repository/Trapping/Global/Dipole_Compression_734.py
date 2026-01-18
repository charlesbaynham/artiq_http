from artiq.experiment import EnvExperiment, NumberValue


class DipoleCompression734(EnvExperiment):
    """Dummy experiment for Dipole Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(24, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.1570233601919053, unit="ms"))

    def run(self):
        print("Starting Dipole_Compression_734")
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Compression_734 Complete")
