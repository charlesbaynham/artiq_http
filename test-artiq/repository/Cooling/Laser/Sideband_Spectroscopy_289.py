from artiq.experiment import EnvExperiment, NumberValue


class SidebandSpectroscopy289(EnvExperiment):
    """Dummy experiment for Sideband Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(86, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.058872203295343, unit="ms"))

    def run(self):
        print("Starting Sideband_Spectroscopy_289")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Spectroscopy_289 Complete")
