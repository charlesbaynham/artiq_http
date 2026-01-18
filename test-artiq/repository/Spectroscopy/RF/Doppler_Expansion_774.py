from artiq.experiment import EnvExperiment, NumberValue


class DopplerExpansion774(EnvExperiment):
    """Dummy experiment for Doppler Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(52, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.7814170137366605, unit="ms"))

    def run(self):
        print("Starting Doppler_Expansion_774")
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Expansion_774 Complete")
