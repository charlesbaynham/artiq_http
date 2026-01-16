import pytest


def pytest_addoption(parser):
    parser.addoption("--runslow", action="store_true", default=False, help="run slow tests")
    parser.addoption(
        "--realserver",
        action="store_true",
        default=False,
        help="run tests that require a real ARTIQ server",
    )


def pytest_configure(config):
    config.addinivalue_line("markers", "slow: mark test as slow to run")
    config.addinivalue_line("markers", "realserver: mark test as requiring a real ARTIQ server")


def pytest_collection_modifyitems(config, items):
    if not config.getoption("--runslow"):
        skip_slow = pytest.mark.skip(reason="need --runslow option to run")
        for item in items:
            if "slow" in item.keywords:
                item.add_marker(skip_slow)

    if not config.getoption("--realserver"):
        skip_realserver = pytest.mark.skip(reason="need --realserver option to run (requires real ARTIQ server)")
        for item in items:
            if "realserver" in item.keywords:
                item.add_marker(skip_realserver)
