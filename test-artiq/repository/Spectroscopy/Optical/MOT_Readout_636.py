from artiq.experiment import EnvExperiment, NumberValue


class MOTReadout636(EnvExperiment):
    """Dummy experiment for MOT Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(97, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.043555134031596, unit="ms"))

    def run(self):
        print("Starting MOT_Readout_636")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Readout_636 Complete")
