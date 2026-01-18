from artiq.experiment import EnvExperiment, NumberValue


class ClockPrep339(EnvExperiment):
    """Dummy experiment for Clock Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(52, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.767209387023017, unit="ms"))

    def run(self):
        print("Starting Clock_Prep_339")
        self.set_dataset("results", self.count, broadcast=True)
        print("Clock_Prep_339 Complete")
