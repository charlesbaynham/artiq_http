import os

config = {
    "host": os.getenv("ARTIQ_HTTP_HOST", "10.137.1.252"),
    "port_notifiers": int(os.getenv("ARTIQ_HTTP_PORT_NOTIFIERS", "3250")),
    "port_clients": int(os.getenv("ARTIQ_HTTP_PORT_CLIENTS", "3251")),
    "dev_mode": "NODE_ENV" in os.environ and os.environ["NODE_ENV"] == "development",
    "old_artiq_support": os.getenv("ARTIQ_HTTP_OLD_ARTIQ_SUPPORT", "false").lower() in ("true", "1", "yes"),
}
