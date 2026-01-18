from artiq.experiment import EnvExperiment, NumberValue


class MOTCooling464(EnvExperiment):
    """Dummy experiment for MOT Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(96, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.264077665232314, unit="ms"))

    def run(self):
        print("Starting MOT_Cooling_464")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Cooling_464 Complete")
