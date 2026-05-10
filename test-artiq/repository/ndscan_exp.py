from ndscan.experiment import ExpFragment, make_fragment_scan_exp


class DummyFrag(ExpFragment):
    def build_fragment(self):
        pass

    def run_once(self):
        pass


dummy = make_fragment_scan_exp(DummyFrag)
