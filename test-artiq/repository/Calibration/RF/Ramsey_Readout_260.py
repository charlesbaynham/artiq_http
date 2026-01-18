from artiq.experiment import EnvExperiment, NumberValue


class RamseyReadout260(EnvExperiment):
    """Dummy experiment for Ramsey Readout"""

    def build(self):
        self.setattr_argument("count", NumberValue(30, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(5.336373996872611, unit="ms"))

    def run(self):
        print("Starting Ramsey_Readout_260")
        self.set_dataset("results", self.count, broadcast=True)
        print("Ramsey_Readout_260 Complete")
