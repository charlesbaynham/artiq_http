from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPCooling838(EnvExperiment):
    """Dummy experiment for STIRAP Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(99, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.8399523236528654, unit="s"))

    def run(self):
        print("Starting STIRAP_Cooling_838")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Cooling_838 Complete")
