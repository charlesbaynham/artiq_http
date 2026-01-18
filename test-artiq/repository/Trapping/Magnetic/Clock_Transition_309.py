from artiq.experiment import EnvExperiment, NumberValue


class ClockTransition309(EnvExperiment):
    """Dummy experiment for Clock Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(5, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.2580464416832315, unit="ms"))

    def run(self):
        print("Starting Clock_Transition_309")
        self.set_dataset("results", self.count, broadcast=True)
        print("Clock_Transition_309 Complete")
