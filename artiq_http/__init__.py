"""artiq_http - A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API"""

__author__ = "Charles Baynham <charles.baynham@gmail.com>"
__all__ = []

from ._version import get_version

__version__ = get_version()
del get_version
