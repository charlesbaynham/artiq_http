from artiq.experiment import EnvExperiment, NumberValue


class SisyphusShift827(EnvExperiment):
    """Dummy experiment for Sisyphus Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(51, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.6233154509328256, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Shift_827")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Shift_827 Complete")
