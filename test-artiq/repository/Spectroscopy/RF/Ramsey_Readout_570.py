from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class RamseyReadout570(EnvExperiment):
    """Dummy experiment for Ramsey Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(48, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.8187952454734224, unit="s"))

    def run(self):
        print("Starting Ramsey_Readout_570")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Readout_570 Complete")
