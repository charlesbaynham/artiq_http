from artiq.experiment import EnvExperiment, NumberValue


class MOTSpectroscopy109(EnvExperiment):
    """Dummy experiment for MOT Spectroscopy"""

    def build(self):
        self.setattr_argument("count", NumberValue(51, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.5608553985181244, unit="ms"))

    def run(self):
        print("Starting MOT_Spectroscopy_109")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Spectroscopy_109 Complete")
