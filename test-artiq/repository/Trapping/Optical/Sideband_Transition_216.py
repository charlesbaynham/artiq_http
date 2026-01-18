from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SidebandTransition216(EnvExperiment):
    """Dummy experiment for Sideband Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(44, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.9951385416093808, unit="s"))

    def run(self):
        print("Starting Sideband_Transition_216")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Transition_216 Complete")
