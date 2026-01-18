from artiq.experiment import EnvExperiment, NumberValue


class RabiPrep276(EnvExperiment):
    """Dummy experiment for Rabi Prep"""

    def build(self):
        self.setattr_argument("count", NumberValue(83, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(6.802451536580316, unit="ms"))

    def run(self):
        print("Starting Rabi_Prep_276")
        self.set_dataset("results", self.count, broadcast=True)
        print("Rabi_Prep_276 Complete")
