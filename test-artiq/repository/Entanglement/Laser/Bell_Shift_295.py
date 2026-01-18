from artiq.experiment import EnvExperiment, NumberValue


class BellShift295(EnvExperiment):
    """Dummy experiment for Bell Shift"""

    def build(self):
        self.setattr_argument("count", NumberValue(72, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.292297991236696, unit="ms"))

    def run(self):
        print("Starting Bell_Shift_295")
        self.set_dataset("results", self.count, broadcast=True)
        print("Bell_Shift_295 Complete")
