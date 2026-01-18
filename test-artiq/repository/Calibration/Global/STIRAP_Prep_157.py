from artiq.experiment import EnvExperiment, NumberValue


class STIRAPPrep157(EnvExperiment):
    """Dummy experiment for STIRAP Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(83, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.2129589314956886, unit="ms"))

    def run(self):
        print("Starting STIRAP_Prep_157")
        self.set_dataset("results", self.count, broadcast=True)
        print("STIRAP_Prep_157 Complete")
