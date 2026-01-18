from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfinePrep997(EnvExperiment):
    """Dummy experiment for Hyperfine Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(65, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.6743995121901936, unit="s"))

    def run(self):
        print("Starting Hyperfine_Prep_997")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Prep_997 Complete")
