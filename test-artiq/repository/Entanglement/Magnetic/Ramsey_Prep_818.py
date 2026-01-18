from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseyPrep818(EnvExperiment):
    """Dummy experiment for Ramsey Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(69, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.9863764919095983, unit="s"))

    def run(self):
        print("Starting Ramsey_Prep_818")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Prep_818 Complete")
