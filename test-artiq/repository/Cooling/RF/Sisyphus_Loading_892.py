from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class SisyphusLoading892(EnvExperiment):
    """Dummy experiment for Sisyphus Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(71, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.598205186148098, unit="s"))

    def run(self):
        print("Starting Sisyphus_Loading_892")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Loading_892 Complete")
