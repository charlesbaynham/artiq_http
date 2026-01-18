from artiq.experiment import EnvExperiment, NumberValue


class BellExpansion879(EnvExperiment):
    """Dummy experiment for Bell Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(49, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.6528109940144273, unit="ms"))

    def run(self):
        print("Starting Bell_Expansion_879")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Expansion_879 Complete")
