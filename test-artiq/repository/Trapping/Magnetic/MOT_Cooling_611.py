from artiq.experiment import EnvExperiment, NumberValue


class MOTCooling611(EnvExperiment):
    """Dummy experiment for MOT Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(47, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.752889183598191, unit="ms"))

    def run(self):
        print("Starting MOT_Cooling_611")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Cooling_611 Complete")
