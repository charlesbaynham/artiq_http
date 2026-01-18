from artiq.experiment import EnvExperiment, NumberValue


class EITPrep302(EnvExperiment):
    """Dummy experiment for EIT Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(73, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(9.968244142645469, unit="ms"))

    def run(self):
        print("Starting EIT_Prep_302")
        self.set_dataset("results", self.count, broadcast=True)
        print("EIT_Prep_302 Complete")
