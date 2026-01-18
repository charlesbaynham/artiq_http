from artiq.experiment import EnvExperiment, NumberValue


class StarkAlignment758(EnvExperiment):
    """Dummy experiment for Stark Alignment"""

    def build(self):
        self.setattr_argument("count", NumberValue(61, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.162050774720878, unit="ms"))

    def run(self):
        print("Starting Stark_Alignment_758")
        self.set_dataset("results", self.count, broadcast=True)
        print("Stark_Alignment_758 Complete")
