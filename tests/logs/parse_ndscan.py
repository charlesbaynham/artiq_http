# %%

from sipyco import pyon
import json

file = "explist_debug.json"

explist = json.load(open(file, "r"))

experiment = "MeasureSingleXODTAbs"

experiments = explist["experiments"]
experiment_info = [e for e in experiments if e["class_name"] == experiment][0]

# %%

experiment_info

# %%

ndscan_params = experiment_info["arginfo"]["ndscan_params"]
print(ndscan_params)

# %% Default value

pyon.decode(ndscan_params[0]["default"])
