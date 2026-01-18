from artiq.experiment import EnvExperiment, NumberValue


class SimpleExp(EnvExperiment):
    """Minimal Experiment

    A simple experiment that sets a dataset to demonstrate basic functionality.
    """

    def build(self):
        self.setattr_argument("count", NumberValue(10, step=1, precision=0))

    def run(self):
        print("Starting Simple Experiment")
        self.set_dataset("results", self.count, broadcast=True)
        print("Simple Experiment Complete")
