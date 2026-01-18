from artiq.experiment import EnvExperiment, NumberValue


class DopplerFlops856(EnvExperiment):
    """Dummy experiment for Doppler Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(32, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.0872056872657099, unit="ms"))

    def run(self):
        print("Starting Doppler_Flops_856")
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Flops_856 Complete")
