from artiq.experiment import EnvExperiment, NumberValue


class SisyphusLoading177(EnvExperiment):
    """Dummy experiment for Sisyphus Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(44, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.4042674088388999, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Loading_177")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Loading_177 Complete")
