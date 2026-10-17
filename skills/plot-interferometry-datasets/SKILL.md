---
name: plot-interferometry-datasets
description: Plot ARTIQ ndscan interferometry experiment data as ASCII art in the terminal. Use when the user wants to visualise RID results (excitation fraction, atom number, imbalance) from an ARTIQ master.
---

# Plot Interferometry Datasets

Quickly visualise ndscan interferometry experiment results from the ARTIQ master as ASCII plots in a terminal.

## When to use

When a user asks to plot, visualise, or see the results of a specific ARTIQ RID (Run ID), especially interferometry scans showing excitation fraction, atom number, or imbalance vs detuning.

## Prerequisites

- `uv` installed (https://github.com/astral-sh/uv)
- Network access to the artiq_http backend

## Usage

```bash
# Plot data for RID 71798 against the ARTIQ system this plugin is configured for
scripts/run_plot_rid.sh 71798 ${user_config.artiq_url}/api

# Plot data for a different RID against an explicit server
scripts/run_plot_rid.sh 71800 http://localhost:8000
```

The server URL comes from the plugin's `artiq_url` option (set at install time, or changed
with `claude plugin configure artiq-http@artiq-http`). The script itself cannot read that
option from the environment, so always pass `<artiq_url>/api` as the second argument. If
the argument is omitted the script falls back to `http://localhost:8000`.

## What it does

1. Creates a Python venv in `/tmp/artiq-plot-venv` using `uv` (idempotent)
2. Installs `plotext` if not already present
3. Fetches ndscan datasets from the artiq_http API for the given RID
4. Plots three ASCII charts:
   - **Excitation fraction** (forward + backward) vs detuning
   - **Atom number** (forward + backward) vs detuning
   - **Atom number imbalance** vs detuning

## API endpoints used

- `GET /datasets/names` — list all datasets
- `GET /datasets/values?names=...` — fetch values for specific datasets

Datasets are filtered by the ndscan prefix `ndscan.rid_{RID}.points.*`.
