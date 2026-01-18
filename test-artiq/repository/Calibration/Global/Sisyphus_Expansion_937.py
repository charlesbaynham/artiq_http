from artiq.experiment import EnvExperiment, NumberValue


class SisyphusExpansion937(EnvExperiment):
    """Dummy experiment for Sisyphus Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(16, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.1497858229973309, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Expansion_937")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Expansion_937 Complete")
