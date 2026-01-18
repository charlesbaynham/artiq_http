from artiq.experiment import EnvExperiment, NumberValue


class BellFlops140(EnvExperiment):
    """Dummy experiment for Bell Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(34, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.098350090379699, unit="ms"))

    def run(self):
        print("Starting Bell_Flops_140")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Flops_140 Complete")
