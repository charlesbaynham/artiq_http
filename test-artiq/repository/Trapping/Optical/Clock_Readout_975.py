from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class ClockReadout975(EnvExperiment):
    """Dummy experiment for Clock Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(77, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.764884205236528, unit="s"))

    def run(self):
        print("Starting Clock_Readout_975")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Clock_Readout_975 Complete")
