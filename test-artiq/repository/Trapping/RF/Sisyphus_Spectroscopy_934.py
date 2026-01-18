from artiq.experiment import EnvExperiment, NumberValue


class SisyphusSpectroscopy934(EnvExperiment):
    """Dummy experiment for Sisyphus Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(9, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.797264870262135, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Spectroscopy_934")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Spectroscopy_934 Complete")
