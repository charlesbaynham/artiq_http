from artiq.experiment import EnvExperiment, NumberValue


class BellTransition457(EnvExperiment):
    """Dummy experiment for Bell Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(84, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.492833298894448, unit="ms"))

    def run(self):
        print("Starting Bell_Transition_457")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Transition_457 Complete")
