from artiq.experiment import EnvExperiment, NumberValue


class SisyphusShift195(EnvExperiment):
    """Dummy experiment for Sisyphus Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(2, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.099273232766387, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Shift_195")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Shift_195 Complete")
