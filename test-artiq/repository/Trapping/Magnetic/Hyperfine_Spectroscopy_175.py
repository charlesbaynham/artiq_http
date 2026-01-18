from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineSpectroscopy175(EnvExperiment):
    """Dummy experiment for Hyperfine Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(64, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.320536632947293, unit="s"))

    def run(self):
        print("Starting Hyperfine_Spectroscopy_175")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Spectroscopy_175 Complete")
