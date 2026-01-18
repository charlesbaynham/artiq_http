from artiq.experiment import EnvExperiment, NumberValue


class BellSpectroscopy974(EnvExperiment):
    """Dummy experiment for Bell Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(73, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.761083532292448, unit="ms"))

    def run(self):
        print("Starting Bell_Spectroscopy_974")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Spectroscopy_974 Complete")
