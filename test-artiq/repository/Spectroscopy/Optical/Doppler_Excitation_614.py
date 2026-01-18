from artiq.experiment import EnvExperiment, NumberValue


class DopplerExcitation614(EnvExperiment):
    """Dummy experiment for Doppler Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(40, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.022807828329392, unit="ms"))

    def run(self):
        print("Starting Doppler_Excitation_614")
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Excitation_614 Complete")
