from artiq.experiment import EnvExperiment, NumberValue


class RabiFlops510(EnvExperiment):
    """Dummy experiment for Rabi Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(20, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.874292315815141, unit="ms"))

    def run(self):
        print("Starting Rabi_Flops_510")
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Flops_510 Complete")
