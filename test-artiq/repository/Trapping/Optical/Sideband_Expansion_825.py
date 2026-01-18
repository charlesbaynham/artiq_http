from artiq.experiment import EnvExperiment, NumberValue


class SidebandExpansion825(EnvExperiment):
    """Dummy experiment for Sideband Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(22, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.902197046871753, unit="ms"))

    def run(self):
        print("Starting Sideband_Expansion_825")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Expansion_825 Complete")
