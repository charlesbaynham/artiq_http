from artiq.experiment import EnvExperiment, NumberValue


class DipoleSpectroscopy209(EnvExperiment):
    """Dummy experiment for Dipole Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(70, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(8.266736273639426, unit="ms"))

    def run(self):
        print("Starting Dipole_Spectroscopy_209")
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Spectroscopy_209 Complete")
