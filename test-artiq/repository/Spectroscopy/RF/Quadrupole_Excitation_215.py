from artiq.experiment import EnvExperiment, NumberValue


class QuadrupoleExcitation215(EnvExperiment):
    """Dummy experiment for Quadrupole Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(50, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.764262656102407, unit="ms"))

    def run(self):
        print("Starting Quadrupole_Excitation_215")
        self.set_dataset("results", self.count, broadcast=True)
        print("Quadrupole_Excitation_215 Complete")
