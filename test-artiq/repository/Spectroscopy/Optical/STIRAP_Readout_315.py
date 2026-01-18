from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class STIRAPReadout315(EnvExperiment):
    """Dummy experiment for STIRAP Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(24, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.8082208973101708, unit="s"))

    def run(self):
        print("Starting STIRAP_Readout_315")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Readout_315 Complete")
