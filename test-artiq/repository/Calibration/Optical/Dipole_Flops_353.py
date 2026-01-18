from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class DipoleFlops353(EnvExperiment):
    """Dummy experiment for Dipole Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(6, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.14195981929939733, unit="s"))

    def run(self):
        print("Starting Dipole_Flops_353")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Flops_353 Complete")
