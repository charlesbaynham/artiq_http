from artiq.experiment import EnvExperiment, NumberValue


class StarkPrep885(EnvExperiment):
    """Dummy experiment for Stark Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(53, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.423884152219867, unit="ms"))

    def run(self):
        print("Starting Stark_Prep_885")
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Prep_885 Complete")
