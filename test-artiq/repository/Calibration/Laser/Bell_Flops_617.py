from artiq.experiment import EnvExperiment, NumberValue


class BellFlops617(EnvExperiment):
    """Dummy experiment for Bell Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(18, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.551372199033598, unit="ms"))

    def run(self):
        print("Starting Bell_Flops_617")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Flops_617 Complete")
