from artiq.experiment import EnvExperiment, NumberValue


class EITExcitation917(EnvExperiment):
    """Dummy experiment for EIT Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(12, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.869940415404965, unit="ms"))

    def run(self):
        print("Starting EIT_Excitation_917")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Excitation_917 Complete")
