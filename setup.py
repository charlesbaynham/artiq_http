import io
import os
import re

import setuptools

import package_versioning


def myversion():
    from artiq_http._version import get_version

    return get_version()


def read(filename):
    filename = os.path.join(os.path.dirname(__file__), filename)
    text_type = type("")
    with io.open(filename, mode="r", encoding="utf-8") as fd:
        return re.sub(text_type(r":[a-z]+:`~?(.*?)`"), text_type(r"``\1``"), fd.read())


setuptools.setup(
    version=myversion(),
    cmdclass=package_versioning.get_cmdclass(),
    name="artiq_http",
    url="http://gitlab.com/yourname/packagename",
    license="None",
    author="Charles Baynham",
    author_email="charles.baynham@gmail.com",
    description="A controller for ARTIQ which exposes ARTIQ's functionality as a RESTful API",
    long_description=read("README.rst"),
    packages=setuptools.find_packages(exclude=("tests",)),
    package_data={"artiq_http": ["static/*", "static/*/*"]},
    install_requires=[
        r
        for r in open("requirements.in").read().splitlines()
        if r and not re.match(r"\s*\#", r)
    ],
    extras_require={
        "dev": [
            r
            for r in open("requirementsDev.in").read().splitlines()
            if r and not re.match(r"\s*\#", r)
        ]
    },
    entry_points={
        "console_scripts": [
            "aqctl_artiq_http = artiq_http.main:main",
        ]
    },
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
)
