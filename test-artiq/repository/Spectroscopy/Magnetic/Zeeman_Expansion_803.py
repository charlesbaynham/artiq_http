from artiq.experiment import EnvExperiment, NumberValue


class ZeemanExpansion803(EnvExperiment):
    """Dummy experiment for Zeeman Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(5, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.902078076646671, unit="ms"))

    def run(self):
        print("Starting Zeeman_Expansion_803")
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Expansion_803 Complete")
