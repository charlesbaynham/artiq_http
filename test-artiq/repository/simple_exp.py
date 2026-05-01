from artiq.experiment import EnvExperiment, NumberValue


class SimpleExp(EnvExperiment):
    def build(self):
        self.setattr_argument("count", NumberValue(default=10, ndecimals=0, step=1))

    def run(self):
        # We need the value to be stored in the datasets at index 1 to match tests
        # datasets["results"][1] == 15
        self.set_dataset("results", [1, self.count], broadcast=True)
