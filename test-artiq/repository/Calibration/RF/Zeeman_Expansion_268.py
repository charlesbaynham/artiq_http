from artiq.experiment import EnvExperiment, NumberValue


class ZeemanExpansion268(EnvExperiment):
    """Dummy experiment for Zeeman Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(34, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.412849212478557, unit="ms"))

    def run(self):
        print("Starting Zeeman_Expansion_268")
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Expansion_268 Complete")
