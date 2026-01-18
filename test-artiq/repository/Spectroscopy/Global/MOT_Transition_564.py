from artiq.experiment import EnvExperiment, NumberValue


class MOTTransition564(EnvExperiment):
    """Dummy experiment for MOT Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(1, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.991369126550633, unit="ms"))

    def run(self):
        print("Starting MOT_Transition_564")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Transition_564 Complete")
