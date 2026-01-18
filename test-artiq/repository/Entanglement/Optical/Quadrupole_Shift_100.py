from artiq.experiment import EnvExperiment, NumberValue


class QuadrupoleShift100(EnvExperiment):
    """Dummy experiment for Quadrupole Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(46, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.3567270569070233, unit="ms"))

    def run(self):
        print("Starting Quadrupole_Shift_100")
        self.set_dataset("results", self.count, broadcast=True)
        print("Quadrupole_Shift_100 Complete")
