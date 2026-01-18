from artiq.experiment import EnvExperiment, NumberValue


class SisyphusFlops806(EnvExperiment):
    """Dummy experiment for Sisyphus Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(88, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.40191078970823857, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Flops_806")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Flops_806 Complete")
