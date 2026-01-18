from artiq.experiment import EnvExperiment, NumberValue


class DipoleFlops781(EnvExperiment):
    """Dummy experiment for Dipole Flops"""

    def build(self):
        self.setattr_argument("count", NumberValue(22, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.0656673146758657, unit="ms"))

    def run(self):
        print("Starting Dipole_Flops_781")
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Flops_781 Complete")
