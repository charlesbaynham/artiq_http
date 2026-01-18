from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class StarkTransition867(EnvExperiment):
    """Dummy experiment for Stark Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(18, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.7100412318084754, unit="s"))

    def run(self):
        print("Starting Stark_Transition_867")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Transition_867 Complete")
