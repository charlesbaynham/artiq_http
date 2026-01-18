from artiq.experiment import EnvExperiment, NumberValue


class DopplerExcitation264(EnvExperiment):
    """Dummy experiment for Doppler Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(60, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.14425783306152534, unit="ms"))

    def run(self):
        print("Starting Doppler_Excitation_264")
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Excitation_264 Complete")
