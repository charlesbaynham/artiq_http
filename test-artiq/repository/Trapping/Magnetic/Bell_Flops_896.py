from artiq.experiment import EnvExperiment, NumberValue


class BellFlops896(EnvExperiment):
    """Dummy experiment for Bell Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(8, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.82678769425328, unit="ms"))

    def run(self):
        print("Starting Bell_Flops_896")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Flops_896 Complete")
