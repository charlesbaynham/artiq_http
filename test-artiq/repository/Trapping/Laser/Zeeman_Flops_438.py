from artiq.experiment import EnvExperiment, NumberValue


class ZeemanFlops438(EnvExperiment):
    """Dummy experiment for Zeeman Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(85, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.5431024897006191, unit="ms"))

    def run(self):
        print("Starting Zeeman_Flops_438")
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Flops_438 Complete")
