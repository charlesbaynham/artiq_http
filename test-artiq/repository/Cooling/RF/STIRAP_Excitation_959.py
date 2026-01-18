from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPExcitation959(EnvExperiment):
    """Dummy experiment for STIRAP Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(23, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.620168665274866, unit="s"))

    def run(self):
        print("Starting STIRAP_Excitation_959")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Excitation_959 Complete")
