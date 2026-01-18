from artiq.experiment import EnvExperiment, NumberValue


class EITFlops749(EnvExperiment):
    """Dummy experiment for EIT Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(77, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.2877194641106486, unit="ms"))

    def run(self):
        print("Starting EIT_Flops_749")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Flops_749 Complete")
