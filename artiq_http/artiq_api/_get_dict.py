import asyncio
import logging

from sipyco.sync_struct import Subscriber

from ..config import config

logger = logging.getLogger(__name__)


async def get_dict(notifier_name, timeout=3.0):
    """
    Get a dict that's being served from a Sipyco sync_strut :class:`.Notifier`

    Args:
        host (str): Server to connect to
        notifier_name (str): Name of RPC notifier
        port (int, optional): Network port. Defaults to 3250.
        timeout (float, optional): Timeout before giving up. Defaults to 3.0.

    Returns:
        dict: The dict returned from the server
    """
    d = dict()
    update_occured = asyncio.Event()

    logger.debug("Getting dict from notifier %s", notifier_name)

    def init_d(x):
        d.clear()
        d.update(x)
        return d

    def register_update(_):
        update_occured.set()

    subscriber = Subscriber(
        notifier_name,
        target_builder=init_d,
        notify_cb=register_update,
        disconnect_cb=None,
    )

    asyncio.create_task(subscriber.connect(config["host"], config["port_notifiers"]))

    try:
        logger.debug("Waiting for successful update")
        await asyncio.wait_for(update_occured.wait(), timeout=timeout)
        logger.debug("Update received: %s", d)
    finally:
        await subscriber.close()

    return d
