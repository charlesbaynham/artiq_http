from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPAlignment639(EnvExperiment):
    """Dummy experiment for STIRAP Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(74, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.656651188493528, unit="s"))

    def run(self):
        print("Starting STIRAP_Alignment_639")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Alignment_639 Complete")
