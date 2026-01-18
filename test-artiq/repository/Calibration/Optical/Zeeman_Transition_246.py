from artiq.experiment import EnvExperiment, NumberValue


class ZeemanTransition246(EnvExperiment):
    """Dummy experiment for Zeeman Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(26, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.242255871199795, unit="ms"))

    def run(self):
        print("Starting Zeeman_Transition_246")
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Transition_246 Complete")
