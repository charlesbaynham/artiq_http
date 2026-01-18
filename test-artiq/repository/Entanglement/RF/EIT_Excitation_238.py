from artiq.experiment import EnvExperiment, NumberValue


class EITExcitation238(EnvExperiment):
    """Dummy experiment for EIT Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(98, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.39346937060827, unit="ms"))

    def run(self):
        print("Starting EIT_Excitation_238")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Excitation_238 Complete")
