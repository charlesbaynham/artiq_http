import random
import time

from ndscan.experiment import (
    ExpFragment,
    FloatChannel,
    make_fragment_scan_exp,
)


class PointGeneratorFrag(ExpFragment):
    def build_fragment(self):
        self.setattr_result("output", FloatChannel)
        self.output: FloatChannel

    def run_once(self):
        random_int = random.randint(0, 100)
        time.sleep(0.5)  # Simulate some processing time
        self.output.push(random_int)


PointGenerator = make_fragment_scan_exp(PointGeneratorFrag)
