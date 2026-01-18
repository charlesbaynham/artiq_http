from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DopplerReadout745(EnvExperiment):
    """Dummy experiment for Doppler Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(42, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.549602479305851, unit="s"))

    def run(self):
        print("Starting Doppler_Readout_745")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Readout_745 Complete")
