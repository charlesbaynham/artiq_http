from artiq.experiment import EnvExperiment, NumberValue


class QuadrupoleCompression593(EnvExperiment):
    """Dummy experiment for Quadrupole Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(58, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.293768925058647, unit="ms"))

    def run(self):
        print("Starting Quadrupole_Compression_593")
        self.set_dataset("results", self.count, broadcast=True)
        print("Quadrupole_Compression_593 Complete")
