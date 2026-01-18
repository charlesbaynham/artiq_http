from artiq.experiment import EnvExperiment, NumberValue


class DipoleReadout112(EnvExperiment):
    """Dummy experiment for Dipole Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(12, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.915815892578107, unit="ms"))

    def run(self):
        print("Starting Dipole_Readout_112")
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Readout_112 Complete")
