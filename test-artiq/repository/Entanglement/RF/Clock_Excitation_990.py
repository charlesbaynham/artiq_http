from artiq.experiment import EnvExperiment, NumberValue


class ClockExcitation990(EnvExperiment):
    """Dummy experiment for Clock Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(15, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.911605466515629, unit="ms"))

    def run(self):
        print("Starting Clock_Excitation_990")
        self.set_dataset("results", self.count, broadcast=True)
        print("Clock_Excitation_990 Complete")
