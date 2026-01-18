from artiq.experiment import EnvExperiment, NumberValue


class EITExpansion490(EnvExperiment):
    """Dummy experiment for EIT Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(36, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.618196188326337, unit="ms"))

    def run(self):
        print("Starting EIT_Expansion_490")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Expansion_490 Complete")
