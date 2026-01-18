from artiq.experiment import EnvExperiment, NumberValue


class DopplerPrep158(EnvExperiment):
    """Dummy experiment for Doppler Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(63, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.544899264048657, unit="ms"))

    def run(self):
        print("Starting Doppler_Prep_158")
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Prep_158 Complete")
