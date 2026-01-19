import os
import random

# Configuration
REPO_DIR = "/home/charles/artiq_http/test-artiq/repository"
PRIMARY_FOLDERS = ["Cooling", "Trapping", "Spectroscopy", "Entanglement", "Calibration"]
SECONDARY_FOLDERS = ["Laser", "Magnetic", "RF", "Optical", "Global"]

# Template 1: Basic component test with various parameter types
TEMPLATE_BASIC = """
import numpy as np
import time
from ndscan.experiment import FloatParam, FloatChannel, BoolParam, IntParam, ExpFragment, make_fragment_scan_exp
from ndscan.experiment.parameters import FloatParamHandle, BoolParamHandle, IntParamHandle


class {class_name}Frag(ExpFragment):
    \"\"\"Basic NDScan Experiment {name}

    Tests basic parameter types and single result channel.
    \"\"\"
    def build_fragment(self):
        self.setattr_param("frequency", FloatParam, "Frequency", 100e6, unit="MHz", min=0.0)
        self.frequency: FloatParamHandle

        self.setattr_param("amplitude", FloatParam, "Amplitude", 0.5, unit="V", min=0.0, max=1.0)
        self.amplitude: FloatParamHandle

        self.setattr_param("count", IntParam, "Count", 10, min=1)
        self.count: IntParamHandle

        self.setattr_param("enable_noise", BoolParam, "Enable Noise", default=True)
        self.enable_noise: BoolParamHandle

        self.setattr_result("signal", FloatChannel)
        self.signal: FloatChannel

    def run_once(self):
        time.sleep(100)
        f = self.frequency.get()
        a = self.amplitude.get()
        noise_on = self.enable_noise.get()

        # Simulate result
        val = a * np.sin(2 * np.pi * (f / 1e8))
        if noise_on:
            val += np.random.normal(0, 0.1)

        self.signal.push(val)

{class_name} = make_fragment_scan_exp({class_name}Frag)
"""

# Template 2: Nested experiment (Rabi Flopping simulation)
TEMPLATE_NESTED = """
import numpy as np
import time
from ndscan.experiment import FloatParam, FloatChannel, BoolParam, IntParam, ExpFragment, make_fragment_scan_exp
from ndscan.experiment.parameters import FloatParamHandle, BoolParamHandle, IntParamHandle


class ReadoutFrag(ExpFragment):
    def build_fragment(self):
        self.setattr_param("threshold", FloatParam, "Threshold", 0.5, unit="V")
        self.threshold: FloatParamHandle

        self.setattr_result("counts", FloatChannel)
        self.counts: FloatChannel

    def run_once(self):
        # Simulate readout distribution
        val = np.random.normal(1.0, 0.1) if np.random.rand() > 0.5 else np.random.normal(0.0, 0.1)
        self.counts.push(val)

class {class_name}Frag(ExpFragment):
    \"\"\"Nested Experiment {name}

    Tests nested fragments and interactions.
    \"\"\"
    def build_fragment(self):
        self.setattr_fragment("readout", ReadoutFrag)
        self.readout: ReadoutFrag

        self.setattr_param("frequency", FloatParam, "Rabi Frequency", 10e6, unit="MHz")
        self.frequency: FloatParamHandle

        self.setattr_param("duration", FloatParam, "Pulse Duration", 10e-6, unit="us")
        self.duration: FloatParamHandle

    def run_once(self):
        time.sleep(100)
        # In a real experiment, we'd use frequency/duration here
        # f = self.frequency.get()
        # t = self.duration.get()

        # Execute subfragment
        self.readout.run_once()

{class_name} = make_fragment_scan_exp({class_name}Frag)
"""

# Template 3: Multi-channel results
TEMPLATE_MULTI = """
import numpy as np
import time
from ndscan.experiment import FloatParam, FloatChannel, BoolParam, IntParam, ExpFragment, make_fragment_scan_exp
from ndscan.experiment.parameters import FloatParamHandle, BoolParamHandle, IntParamHandle

class {class_name}Frag(ExpFragment):
    \"\"\"Multi-channel Experiment {name}

    Tests experiments with multiple result channels.
    \"\"\"
    def build_fragment(self):
        self.setattr_param("x_val", FloatParam, "X Value", 0.0, unit="V")
        self.x_val: FloatParamHandle

        self.setattr_result("ch1_raw", FloatChannel)
        self.ch1_raw: FloatChannel

        self.setattr_result("ch2_proc", FloatChannel)
        self.ch2_proc: FloatChannel

    def run_once(self):
        time.sleep(100)
        x = self.x_val.get()

        v1 = np.sin(x) + np.random.normal(0, 0.05)
        v2 = v1 ** 2

        self.ch1_raw.push(v1)
        self.ch2_proc.push(v2)

{class_name} = make_fragment_scan_exp({class_name}Frag)
"""


def generate():
    # Clean up existing repository
    if os.path.exists(REPO_DIR):
        print(f"Cleaning up {REPO_DIR}...")
        # Walk and delete files, ignoring errors (e.g. root-owned pyc files)
        for root, dirs, files in os.walk(REPO_DIR, topdown=False):
            for name in files:
                try:
                    os.remove(os.path.join(root, name))
                except OSError as e:
                    print(f"Could not remove {name}: {e}")
            for name in dirs:
                try:
                    os.rmdir(os.path.join(root, name))
                except OSError as e:
                    print(f"Could not remove directory {name}: {e}")
    else:
        os.makedirs(REPO_DIR)

    count = 0
    templates = [TEMPLATE_BASIC, TEMPLATE_NESTED, TEMPLATE_MULTI]

    for primary in PRIMARY_FOLDERS:
        for secondary in SECONDARY_FOLDERS:
            # Create nested directory
            dir_path = os.path.join(REPO_DIR, primary, secondary)
            os.makedirs(dir_path, exist_ok=True)

            # Generate 1-2 experiments per folder to avoid overcrowding but ensure coverage
            num_exps = random.randint(1, 2)
            for _ in range(num_exps):
                template = random.choice(templates)

                exp_type = "Basic"
                if template == TEMPLATE_NESTED:
                    exp_type = "Nested"
                elif template == TEMPLATE_MULTI:
                    exp_type = "Multi"

                name = f"{exp_type}_{primary}_{secondary}_{random.randint(100, 999)}"
                # Sanitize class name
                class_name = name.replace("_", "")

                file_path = os.path.join(dir_path, f"{name}.py")

                content = template.format(class_name=class_name, name=name)

                with open(file_path, "w") as f:
                    f.write(content)
                count += 1

    print(
        f"Generated {count} realistic ndscan experiments across {len(PRIMARY_FOLDERS) * len(SECONDARY_FOLDERS)} folders."
    )


if __name__ == "__main__":
    generate()
