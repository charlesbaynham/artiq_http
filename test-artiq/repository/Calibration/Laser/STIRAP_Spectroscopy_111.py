from artiq.experiment import EnvExperiment, NumberValue


class STIRAPSpectroscopy111(EnvExperiment):
    """Dummy experiment for STIRAP Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(10, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.570067919254215, unit="ms"))

    def run(self):
        print("Starting STIRAP_Spectroscopy_111")
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Spectroscopy_111 Complete")
