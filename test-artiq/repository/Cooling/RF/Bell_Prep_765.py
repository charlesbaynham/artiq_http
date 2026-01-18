from artiq.experiment import EnvExperiment, NumberValue


class BellPrep765(EnvExperiment):
    """Dummy experiment for Bell Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(5, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.9325312403428616, unit="ms"))

    def run(self):
        print("Starting Bell_Prep_765")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Prep_765 Complete")
