from artiq.experiment import *  # noqa: F401, F403, F405


class MinimalExp(EnvExperiment):
    """Minimal Experiment

    A simple experiment that sets a dataset to demonstrate basic functionality.
    """

    def build(self):
        self.setattr_argument("count", NumberValue(10, step=1, precision=0))
        self.setattr_argument("delay_ms", NumberValue(100, unit="ms"))

    def run(self):
        print("Starting Minimal Experiment")
        for i in range(int(self.count)):
            self.set_dataset("test_count", i, broadcast=True)
            print(f"Iteration {i+1}/{int(self.count)}")
            # Simulate some work
            import time

            time.sleep(self.delay_ms)
        print("Minimal Experiment Complete")
