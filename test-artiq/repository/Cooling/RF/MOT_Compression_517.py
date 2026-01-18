from artiq.experiment import EnvExperiment, NumberValue


class MOTCompression517(EnvExperiment):
    """Dummy experiment for MOT Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(3, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.556374882758073, unit="ms"))

    def run(self):
        print("Starting MOT_Compression_517")
        self.set_dataset("results", self.count, broadcast=True)
        print("MOT_Compression_517 Complete")
