from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleTransition870(EnvExperiment):
    """Dummy experiment for Dipole Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(44, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.629985846114609, unit="s"))

    def run(self):
        print("Starting Dipole_Transition_870")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Transition_870 Complete")
