from artiq.experiment import EnvExperiment, NumberValue


class HyperfineFlops512(EnvExperiment):
    """Dummy experiment for Hyperfine Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(50, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.8990758525073606, unit="ms"))

    def run(self):
        print("Starting Hyperfine_Flops_512")
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Flops_512 Complete")
