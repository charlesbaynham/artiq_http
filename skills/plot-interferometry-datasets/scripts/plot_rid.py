import json
import sys
import urllib.error
import urllib.request

RID = sys.argv[1]
SERVER = sys.argv[2].rstrip("/")


def api_get(path, params=None):
    url = f"{SERVER}{path}"
    if params:
        url += "?" + "&".join(f"{k}={v}" for k, v in params.items())
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"HTTP {e.code}: {body}", file=sys.stderr)
        raise


def get_dataset_values(names):
    """Fetch values for one or more datasets by name.

    The artiq_http /datasets/values endpoint returns each entry as
    [persist_flag, value, metadata_dict]. Unwrap to the bare value list."""
    if not names:
        return {}
    names_str = ",".join(names)
    raw = api_get("/datasets/values", {"names": names_str})
    unwrapped = {}
    for k, v in raw.items():
        if isinstance(v, list) and len(v) >= 2 and isinstance(v[0], bool):
            unwrapped[k] = v[1]
        else:
            unwrapped[k] = v
    return unwrapped


def list_dataset_names():
    """Return list of all dataset names from the ARTIQ master."""
    return api_get("/datasets/names").get("names", [])


def find_rid_datasets(rid):
    """Find all ndscan datasets belonging to a specific RID."""
    prefix = f"ndscan.rid_{rid}."
    all_names = list_dataset_names()
    rid_names = [n for n in all_names if n.startswith(prefix)]
    return rid_names


def plot_rid(rid):
    print(f"Fetching datasets for RID {rid} from {SERVER} ...")

    rid_datasets = find_rid_datasets(rid)
    if not rid_datasets:
        print(f"No ndscan datasets found for RID {rid}", file=sys.stderr)
        sys.exit(1)

    # Identify key channels
    axis_name = f"ndscan.rid_{rid}.points.axis_0"
    exc_fw = f"ndscan.rid_{rid}.points.channel_excitation_fraction_forward"
    exc_bw = f"ndscan.rid_{rid}.points.channel_excitation_fraction_backward"
    atom_fw = f"ndscan.rid_{rid}.points.channel_atom_number_forward"
    atom_bw = f"ndscan.rid_{rid}.points.channel_atom_number_backward"
    imbalance = f"ndscan.rid_{rid}.points.channel_atom_number_imbalance"

    to_fetch = [axis_name]
    for ch in [exc_fw, exc_bw, atom_fw, atom_bw, imbalance]:
        if ch in rid_datasets:
            to_fetch.append(ch)

    data = get_dataset_values(to_fetch)

    freq = data.get(axis_name, [])
    if not freq:
        print(f"No axis data found for RID {rid}", file=sys.stderr)
        sys.exit(1)

    import plotext as plt

    # Plot 1: Excitation fraction
    if exc_fw in data or exc_bw in data:
        plt.clf()
        if exc_fw in data:
            plt.plot(freq, data[exc_fw], label="forward", marker="dot")
        if exc_bw in data:
            plt.plot(freq, data[exc_bw], label="backward", marker="dot")
        plt.xlabel("Freq detuning (kHz)")
        plt.ylabel("Excitation fraction")
        plt.title(f"RID {rid} - Excitation Fraction vs Detuning")
        plt.ylim(0, 1.1)
        plt.show()
        print("\n")

    # Plot 2: Atom numbers
    if atom_fw in data or atom_bw in data:
        plt.clf()
        if atom_fw in data:
            plt.plot(freq, data[atom_fw], label="forward", marker="dot")
        if atom_bw in data:
            plt.plot(freq, data[atom_bw], label="backward", marker="dot")
        plt.xlabel("Freq detuning (kHz)")
        plt.ylabel("Atom number")
        plt.title(f"RID {rid} - Atom Number vs Detuning")
        plt.show()
        print("\n")

    # Plot 3: Imbalance
    if imbalance in data:
        plt.clf()
        plt.plot(freq, data[imbalance], label="imbalance", marker="dot", color="red")
        plt.xlabel("Freq detuning (kHz)")
        plt.ylabel("Imbalance")
        plt.title(f"RID {rid} - Atom Number Imbalance vs Detuning")
        plt.show()

    print(f"\nRID {rid} plotted. Found {len(rid_datasets)} datasets.")


if __name__ == "__main__":
    plot_rid(RID)
