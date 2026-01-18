from artiq.experiment import EnvExperiment, NumberValue


class DipoleExpansion297(EnvExperiment):
    """Dummy experiment for Dipole Expansion"""

    def build(self):
        self.setattr_argument("count", NumberValue(73, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.84704709478513, unit="ms"))

    def run(self):
        print("Starting Dipole_Expansion_297")
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Expansion_297 Complete")
