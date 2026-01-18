from artiq.experiment import EnvExperiment, NumberValue


class QuadrupoleTransition419(EnvExperiment):
    """Dummy experiment for Quadrupole Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(76, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.95133464354874, unit="ms"))

    def run(self):
        print("Starting Quadrupole_Transition_419")
        self.set_dataset("results", self.count, broadcast=True)
        print("Quadrupole_Transition_419 Complete")
