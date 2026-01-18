from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPPrep330(EnvExperiment):
    """Dummy experiment for STIRAP Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(58, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.456361876757413, unit="s"))

    def run(self):
        print("Starting STIRAP_Prep_330")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Prep_330 Complete")
