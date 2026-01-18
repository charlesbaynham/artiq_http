from artiq.experiment import EnvExperiment, NumberValue


class RabiSpectroscopy807(EnvExperiment):
    """Dummy experiment for Rabi Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(69, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.13485999639482252, unit="ms"))

    def run(self):
        print("Starting Rabi_Spectroscopy_807")
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Spectroscopy_807 Complete")
