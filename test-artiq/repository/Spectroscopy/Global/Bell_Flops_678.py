from artiq.experiment import EnvExperiment, NumberValue


class BellFlops678(EnvExperiment):
    """Dummy experiment for Bell Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(53, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.114509276479483, unit="ms"))

    def run(self):
        print("Starting Bell_Flops_678")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Flops_678 Complete")
