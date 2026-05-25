import os

config = {
    "host": os.getenv("ARTIQ_HTTP_HOST", "127.0.0.1"),
    "port_notifiers": int(os.getenv("ARTIQ_HTTP_PORT_NOTIFIERS", "3250")),
    "port_clients": int(os.getenv("ARTIQ_HTTP_PORT_CLIENTS", "3251")),
    "port_broadcast": int(os.getenv("ARTIQ_HTTP_PORT_BROADCAST", "1067")),
    "dev_mode": "NODE_ENV" in os.environ and os.environ["NODE_ENV"] == "development",
    "old_artiq_support": os.getenv("ARTIQ_HTTP_OLD_ARTIQ_SUPPORT", "false").lower() in ("true", "1", "yes"),
    "mock": os.getenv("ARTIQ_HTTP_MOCK", "false").lower() in ("true", "1", "yes"),
}
