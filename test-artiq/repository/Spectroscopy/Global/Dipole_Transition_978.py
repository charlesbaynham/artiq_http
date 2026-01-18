from artiq.experiment import EnvExperiment, NumberValue


class DipoleTransition978(EnvExperiment):
    """Dummy experiment for Dipole Transition"""

    def build(self):
        self.setattr_argument("count", NumberValue(97, step=1, precision=0))
        self.setattr_argument("delay", NumberValue(0.6880157388069401, unit="ms"))

    def run(self):
        print("Starting Dipole_Transition_978")
        self.set_dataset("results", self.count, broadcast=True)
        print("Dipole_Transition_978 Complete")
