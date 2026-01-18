from artiq.experiment import EnvExperiment, NumberValue


class StarkExcitation543(EnvExperiment):
    """Dummy experiment for Stark Excitation"""

    def build(self):
        self.setattr_argument("count", NumberValue(11, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(4.519371042487251, unit="ms"))

    def run(self):
        print("Starting Stark_Excitation_543")
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Excitation_543 Complete")
