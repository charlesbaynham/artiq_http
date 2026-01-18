from artiq.experiment import EnvExperiment, NumberValue


class StarkLoading894(EnvExperiment):
    """Dummy experiment for Stark Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(65, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.671061706502378, unit="ms"))

    def run(self):
        print("Starting Stark_Loading_894")
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Loading_894 Complete")
