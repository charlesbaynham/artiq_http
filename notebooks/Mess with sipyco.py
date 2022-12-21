# ---
# jupyter:
#   jupytext:
#     formats: ipynb,md,py:percent
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.14.4
#   kernelspec:
#     display_name: Python 3 (ipykernel)
#     language: python
#     name: python3
# ---

# %% [markdown]
# ARTIQ via HTTP
# =====
#
# The goal is to serve an RESTful API for ARTIQ. To do this, I'll set up a FastAPI server which runs as a controller and which interfaces to artiq_master through sipyco. First, though, I'll mess around a bit here until I have a plan. 

# %%
