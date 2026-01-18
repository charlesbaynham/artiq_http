from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanTransition691(EnvExperiment):
    """Dummy experiment for Zeeman Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(72, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.295582503811944, unit="s"))

    def run(self):
        print("Starting Zeeman_Transition_691")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Transition_691 Complete")
