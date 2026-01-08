import os

config = {
    "host": "10.137.1.252",
    "port_notifiers": 3250,
    "port_clients": 3251,
    "dev_mode": "NODE_ENV" in os.environ and os.environ["NODE_ENV"] == "development",
}
