from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleAlignment122(EnvExperiment):
    """Dummy experiment for Dipole Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(81, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(2.407103040009732, unit="s"))

    def run(self):
        print("Starting Dipole_Alignment_122")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Alignment_122 Complete")
