# ---
# jupyter:
#   jupytext:
#     cell_metadata_filter: title,-all
#     formats: ipynb,py:percent
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.18.1
#   kernelspec:
#     display_name: artiq-http-rH_cfFb_-py3.11
#     language: python
#     name: python3
# ---

# %%
import json
import random

from sipyco import pyon

file = "explist_debug.json"

explist = json.load(open(file, "r"))

experiment = "MeasureSingleXODTAbs"

experiments = explist["experiments"]
experiment_info = [e for e in experiments if e["class_name"] == experiment][0]

# %%
experiment_info

# %%
ndscan_params = experiment_info["arginfo"]["ndscan_params"]


# %% Default value
ndscan_value = pyon.decode(ndscan_params[0]["default"])
ndscan_value

# %%
ndscan_value.keys()

# %% Show one param
root_params = ndscan_value["instances"][""]

# Pick a random one from the list
param_name = random.choice(root_params)
param_name


# %% Look up the scheme
scheme = ndscan_value["schemata"][param_name]
scheme
