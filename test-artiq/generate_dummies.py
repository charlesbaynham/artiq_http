import os
import random

# Configuration
REPO_DIR = "/home/charles/artiq_http/test-artiq/repository"
PRIMARY_FOLDERS = ["Cooling", "Trapping", "Spectroscopy", "Entanglement", "Calibration"]
SECONDARY_FOLDERS = ["Laser", "Magnetic", "RF", "Optical", "Global"]

PHYSICS_NOUNS = [
    "MOT",
    "Rabi",
    "Ramsey",
    "Bell",
    "Stark",
    "Zeeman",
    "Doppler",
    "Sisyphus",
    "Sideband",
    "Clock",
    "Dipole",
    "Quadrupole",
    "Hyperfine",
    "EIT",
    "STIRAP",
]

PHYSICS_VERBS = [
    "Loading",
    "Cooling",
    "Spectroscopy",
    "Prep",
    "Readout",
    "Flops",
    "Shift",
    "Transition",
    "Excitation",
    "Compression",
    "Expansion",
    "Alignment",
]

TEMPLATE = """from artiq.experiment import EnvExperiment, NumberValue

class {class_name}(EnvExperiment):
    \"\"\"{docstring}
    \"\"\"

    def build(self):
        self.setattr_argument("count", NumberValue({count}, step=1, precision=0))
        self.setattr_argument("delay", NumberValue({delay}, unit="ms"))

    def run(self):
        print("Starting {name}")
        self.set_dataset("results", self.count, broadcast=True)
        print("{name} Complete")
"""


def generate():
    count = 0
    for primary in PRIMARY_FOLDERS:
        for secondary in SECONDARY_FOLDERS:
            # Create nested directory
            dir_path = os.path.join(REPO_DIR, primary, secondary)
            os.makedirs(dir_path, exist_ok=True)

            # Generate 3-5 experiments per folder
            num_exps = random.randint(3, 5)
            for _ in range(num_exps):
                noun = random.choice(PHYSICS_NOUNS)
                verb = random.choice(PHYSICS_VERBS)
                name = f"{noun}_{verb}_{random.randint(100, 999)}"
                class_name = name.replace("_", "")

                file_path = os.path.join(dir_path, f"{name}.py")

                content = TEMPLATE.format(
                    class_name=class_name,
                    docstring=f"Dummy experiment for {noun} {verb}",
                    count=random.randint(1, 100),
                    delay=random.uniform(0.1, 10.0),
                    name=name,
                )

                with open(file_path, "w") as f:
                    f.write(content)
                count += 1

    print(f"Generated {count} dummy experiments across {len(PRIMARY_FOLDERS) * len(SECONDARY_FOLDERS)} folders.")


if __name__ == "__main__":
    generate()
