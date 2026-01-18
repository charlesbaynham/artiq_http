from artiq.experiment import EnvExperiment, NumberValue


class EITFlops684(EnvExperiment):
    """Dummy experiment for EIT Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(75, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.6759538468422, unit="ms"))

    def run(self):
        print("Starting EIT_Flops_684")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Flops_684 Complete")
