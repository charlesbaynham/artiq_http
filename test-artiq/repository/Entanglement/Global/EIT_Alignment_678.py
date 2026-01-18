from artiq.experiment import EnvExperiment, NumberValue


class EITAlignment678(EnvExperiment):
    """Dummy experiment for EIT Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(50, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.796525220578388, unit="ms"))

    def run(self):
        print("Starting EIT_Alignment_678")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Alignment_678 Complete")
