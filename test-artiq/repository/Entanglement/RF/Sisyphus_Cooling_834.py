from artiq.experiment import EnvExperiment, NumberValue


class SisyphusCooling834(EnvExperiment):
    """Dummy experiment for Sisyphus Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(76, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.386810073422108, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Cooling_834")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Cooling_834 Complete")
