from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPCooling124(EnvExperiment):
    """Dummy experiment for STIRAP Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(77, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.995190830853691, unit="s"))

    def run(self):
        print("Starting STIRAP_Cooling_124")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Cooling_124 Complete")
