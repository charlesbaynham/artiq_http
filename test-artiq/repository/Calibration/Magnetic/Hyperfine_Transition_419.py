from artiq.experiment import EnvExperiment, NumberValue


class HyperfineTransition419(EnvExperiment):
    """Dummy experiment for Hyperfine Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(68, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.061935985661627, unit="ms"))

    def run(self):
        print("Starting Hyperfine_Transition_419")
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Transition_419 Complete")
