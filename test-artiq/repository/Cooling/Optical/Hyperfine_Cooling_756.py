from time import sleep

from artiq.experiment import EnvExperiment, NumberValue


class HyperfineCooling756(EnvExperiment):
    """Dummy experiment for Hyperfine Cooling"""

    def build(self):
        self.setattr_argument("count", NumberValue(40, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(7.679647650309202, unit="s"))

    def run(self):
        print("Starting Hyperfine_Cooling_756")
        sleep(self.delay)
        self.set_dataset("results", self.count, broadcast=True)
        print("Hyperfine_Cooling_756 Complete")
