from artiq.experiment import EnvExperiment, NumberValue


class SisyphusReadout808(EnvExperiment):
    """Dummy experiment for Sisyphus Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(78, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.729532700198156, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Readout_808")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Readout_808 Complete")
