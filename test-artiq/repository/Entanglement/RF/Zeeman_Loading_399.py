from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ZeemanLoading399(EnvExperiment):
    """Dummy experiment for Zeeman Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(55, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.247893528019949, unit="s"))

    def run(self):
        print("Starting Zeeman_Loading_399")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Zeeman_Loading_399 Complete")
