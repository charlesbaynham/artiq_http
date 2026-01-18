from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineTransition191(EnvExperiment):
    """Dummy experiment for Hyperfine Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(52, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.639401807605799, unit="s"))

    def run(self):
        print("Starting Hyperfine_Transition_191")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Transition_191 Complete")
