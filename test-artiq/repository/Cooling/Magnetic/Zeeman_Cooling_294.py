from artiq.experiment import EnvExperiment, NumberValue


class ZeemanCooling294(EnvExperiment):
    """Dummy experiment for Zeeman Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(96, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.269253214597105, unit="ms"))

    def run(self):
        print("Starting Zeeman_Cooling_294")
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Cooling_294 Complete")
