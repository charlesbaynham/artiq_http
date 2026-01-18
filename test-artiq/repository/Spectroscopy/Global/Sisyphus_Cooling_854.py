from artiq.experiment import EnvExperiment, NumberValue


class SisyphusCooling854(EnvExperiment):
    """Dummy experiment for Sisyphus Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(39, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(3.374906256203177, unit="ms"))

    def run(self):
        print("Starting Sisyphus_Cooling_854")
        self.set_dataset("results", self.count, broadcast=True)
        print("Sisyphus_Cooling_854 Complete")
