from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DopplerAlignment785(EnvExperiment):
    """Dummy experiment for Doppler Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(23, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.219064184960956, unit="s"))

    def run(self):
        print("Starting Doppler_Alignment_785")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Doppler_Alignment_785 Complete")
