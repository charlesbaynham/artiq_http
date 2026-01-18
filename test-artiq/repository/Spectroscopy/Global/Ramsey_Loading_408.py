from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseyLoading408(EnvExperiment):
    """Dummy experiment for Ramsey Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(85, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.285657135727512, unit="s"))

    def run(self):
        print("Starting Ramsey_Loading_408")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Loading_408 Complete")
