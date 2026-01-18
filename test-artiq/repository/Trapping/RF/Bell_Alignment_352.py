from artiq.experiment import EnvExperiment, NumberValue


class BellAlignment352(EnvExperiment):
    """Dummy experiment for Bell Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(76, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.1649866276305376, unit="ms"))

    def run(self):
        print("Starting Bell_Alignment_352")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Alignment_352 Complete")
