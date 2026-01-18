from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseyTransition986(EnvExperiment):
    """Dummy experiment for Ramsey Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(39, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.940375965303552, unit="s"))

    def run(self):
        print("Starting Ramsey_Transition_986")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Transition_986 Complete")
