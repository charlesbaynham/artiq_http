from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class EITTransition579(EnvExperiment):
    """Dummy experiment for EIT Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(7, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.364524965711314, unit="s"))

    def run(self):
        print("Starting EIT_Transition_579")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Transition_579 Complete")
