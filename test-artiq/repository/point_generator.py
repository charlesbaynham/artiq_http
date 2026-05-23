import random
import time

from ndscan.experiment import (
    ExpFragment,
    FloatChannel,
    FloatParam,
    make_fragment_scan_exp,
)
from ndscan.experiment.parameters import (
    FloatParamHandle,
)


class PointGeneratorFrag(ExpFragment):
    def build_fragment(self):
        self.setattr_result("output", FloatChannel)
        self.output: FloatChannel

        self.setattr_param(
            "addition",
            FloatParam,
            "addition",
            0.5,
        )
        self.addition: FloatParamHandle

    def run_once(self):
        random_int = random.randint(0, 100)
        time.sleep(0.5)  # Simulate some processing time
        self.output.push(random_int + self.addition.get())


PointGenerator = make_fragment_scan_exp(PointGeneratorFrag)
