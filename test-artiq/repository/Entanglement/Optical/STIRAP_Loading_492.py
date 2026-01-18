from artiq.experiment import EnvExperiment, NumberValue


class STIRAPLoading492(EnvExperiment):
    """Dummy experiment for STIRAP Loading"""

    def build(self):
        self.setattr_argument("count", NumberValue(99, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.786412562382905, unit="ms"))

    def run(self):
        print("Starting STIRAP_Loading_492")
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Loading_492 Complete")
