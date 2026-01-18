from artiq.experiment import EnvExperiment, NumberValue


class MOTLoading304(EnvExperiment):
    """Dummy experiment for MOT Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(64, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.9257992174060692, unit="ms"))

    def run(self):
        print("Starting MOT_Loading_304")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Loading_304 Complete")
