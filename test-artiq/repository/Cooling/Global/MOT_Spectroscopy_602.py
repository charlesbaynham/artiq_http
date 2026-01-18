from artiq.experiment import EnvExperiment, NumberValue


class MOTSpectroscopy602(EnvExperiment):
    """Dummy experiment for MOT Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(1, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.4559809150342367, unit="ms"))

    def run(self):
        print("Starting MOT_Spectroscopy_602")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Spectroscopy_602 Complete")
