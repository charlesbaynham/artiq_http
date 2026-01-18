from artiq.experiment import EnvExperiment, NumberValue


class RamseyCooling938(EnvExperiment):
    """Dummy experiment for Ramsey Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(86, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.964519340872801, unit="ms"))

    def run(self):
        print("Starting Ramsey_Cooling_938")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Cooling_938 Complete")
