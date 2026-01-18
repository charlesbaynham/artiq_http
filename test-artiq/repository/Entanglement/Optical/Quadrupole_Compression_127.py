from artiq.experiment import EnvExperiment, NumberValue


class QuadrupoleCompression127(EnvExperiment):
    """Dummy experiment for Quadrupole Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(89, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.872175997284625, unit="ms"))

    def run(self):
        print("Starting Quadrupole_Compression_127")
        self.set_dataset("results", self.count, broadcast=True)
        print("Quadrupole_Compression_127 Complete")
