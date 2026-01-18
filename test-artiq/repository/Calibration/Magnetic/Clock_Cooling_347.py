from artiq.experiment import EnvExperiment, NumberValue


class ClockCooling347(EnvExperiment):
    """Dummy experiment for Clock Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(96, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.97008715973745, unit="ms"))

    def run(self):
        print("Starting Clock_Cooling_347")
        self.set_dataset("results", self.count, broadcast=True)
        print("Clock_Cooling_347 Complete")
