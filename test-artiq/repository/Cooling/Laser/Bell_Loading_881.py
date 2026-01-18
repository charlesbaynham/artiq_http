from artiq.experiment import EnvExperiment, NumberValue


class BellLoading881(EnvExperiment):
    """Dummy experiment for Bell Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(11, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.24179995405363, unit="ms"))

    def run(self):
        print("Starting Bell_Loading_881")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Loading_881 Complete")
