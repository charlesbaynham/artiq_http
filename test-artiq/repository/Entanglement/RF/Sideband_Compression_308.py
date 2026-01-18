from artiq.experiment import EnvExperiment, NumberValue


class SidebandCompression308(EnvExperiment):
    """Dummy experiment for Sideband Compression"""

    def build(self):
        self.setattr_argument("count", NumberValue(44, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(1.410490328900176, unit="ms"))

    def run(self):
        print("Starting Sideband_Compression_308")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sideband_Compression_308 Complete")
