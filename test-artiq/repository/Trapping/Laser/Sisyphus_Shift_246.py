from artiq.experiment import EnvExperiment, NumberValue


class SisyphusShift246(EnvExperiment):
    """Dummy experiment for Sisyphus Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(54, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.20062080742996, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Shift_246")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Shift_246 Complete")
