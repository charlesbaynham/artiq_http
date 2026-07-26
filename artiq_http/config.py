import os

config = {
    "host": os.getenv("ARTIQ_HTTP_HOST", "127.0.0.1"),
    "port_notifiers": int(os.getenv("ARTIQ_HTTP_PORT_NOTIFIERS", "3250")),
    "port_clients": int(os.getenv("ARTIQ_HTTP_PORT_CLIENTS", "3251")),
    "port_broadcast": int(os.getenv("ARTIQ_HTTP_PORT_BROADCAST", "1067")),
    "old_artiq_support": os.getenv("ARTIQ_HTTP_OLD_ARTIQ_SUPPORT", "false").lower() in ("true", "1", "yes"),
    "mock": os.getenv("ARTIQ_HTTP_MOCK", "false").lower() in ("true", "1", "yes"),
    # Revision/branch to fall back to in the GUI when the user leaves the "Rev / ref"
    # field blank and no lab-wide default revision is set. Empty (default) preserves
    # the historic behaviour of falling back to the master's current revision. Set to
    # a branch name (e.g. "master") to instead always target that ref regardless of
    # whatever revision the ARTIQ master currently has checked out.
    "default_revision": os.getenv("ARTIQ_HTTP_DEFAULT_REVISION", ""),
    # Path to the JSON file backing the lab-wide presets/favourites store (see
    # artiq_http/artiq_api/presets_store.py). Not ARTIQ-dependent, so it works the
    # same in mock and real modes. Parent directories are created on first write.
    "presets_file": os.getenv("ARTIQ_HTTP_PRESETS_FILE", os.path.expanduser("~/.artiq_http/presets.json")),
}
