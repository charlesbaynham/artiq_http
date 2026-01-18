from artiq.experiment import EnvExperiment, NumberValue


class SidebandExcitation484(EnvExperiment):
    """Dummy experiment for Sideband Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(88, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.477301255791446, unit="ms"))

    def run(self):
        print("Starting Sideband_Excitation_484")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Excitation_484 Complete")
