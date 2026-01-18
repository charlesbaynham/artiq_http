from artiq.experiment import EnvExperiment, NumberValue


class StarkPrep448(EnvExperiment):
    """Dummy experiment for Stark Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(17, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.8864885978572334, unit="ms"))

    def run(self):
        print("Starting Stark_Prep_448")
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Prep_448 Complete")
