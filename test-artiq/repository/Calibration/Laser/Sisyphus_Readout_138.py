from artiq.experiment import EnvExperiment, NumberValue


class SisyphusReadout138(EnvExperiment):
    """Dummy experiment for Sisyphus Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(94, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.280972053007762, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Readout_138")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Readout_138 Complete")
