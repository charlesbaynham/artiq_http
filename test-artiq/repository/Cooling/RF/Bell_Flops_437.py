from artiq.experiment import EnvExperiment, NumberValue


class BellFlops437(EnvExperiment):
    """Dummy experiment for Bell Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(21, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.9820474481381871, unit="ms"))

    def run(self):
        print("Starting Bell_Flops_437")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Flops_437 Complete")
