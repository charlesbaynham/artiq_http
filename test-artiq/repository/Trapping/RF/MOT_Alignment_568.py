from artiq.experiment import EnvExperiment, NumberValue


class MOTAlignment568(EnvExperiment):
    """Dummy experiment for MOT Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(75, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.0734132091611313, unit="ms"))

    def run(self):
        print("Starting MOT_Alignment_568")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Alignment_568 Complete")
