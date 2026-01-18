from artiq.experiment import EnvExperiment, NumberValue


class SisyphusFlops439(EnvExperiment):
    """Dummy experiment for Sisyphus Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(45, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.097313942751315, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Flops_439")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Flops_439 Complete")
