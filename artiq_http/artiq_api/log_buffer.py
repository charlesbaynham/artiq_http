"""Ring-buffered receiver for ARTIQ's ``log`` broadcast channel."""

import collections
import logging
from typing import Any

from .persistent_broadcast import PersistentBroadcastReceiver

logger = logging.getLogger(__name__)

DEFAULT_MAX_LOG_ENTRIES = 1000


class LogBuffer:
    """Maintain a bounded ring buffer of ARTIQ log entries.

    Wraps a :class:`PersistentBroadcastReceiver` for the ``log`` broadcast
    channel and registers a callback that normalises each broadcast message
    into a dict and pushes it into a ``deque(maxlen=...)``.
    """

    def __init__(
        self,
        host: str,
        port: int,
        max_entries: int = DEFAULT_MAX_LOG_ENTRIES,
    ):
        self._receiver = PersistentBroadcastReceiver("log", host, port)
        # asyncio-only: _handle_message and get_logs must run on the same event
        # loop; concurrent access from threads is not supported.
        self._buffer: collections.deque = collections.deque(maxlen=max_entries)
        self._receiver.register_message_callback(self._handle_message)

    async def start(self) -> None:
        await self._receiver.start()

    async def stop(self) -> None:
        self._receiver.unregister_message_callback(self._handle_message)
        await self._receiver.stop()

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        return await self._receiver.wait_for_init(timeout)

    def is_connected(self) -> bool:
        return self._receiver.is_connected()

    def get_logs(self) -> list[dict]:
        """Return a copy of the current buffered log entries."""
        return list(self._buffer)

    def _handle_message(self, obj: Any) -> None:
        normalised = self._normalise_entry(obj)
        if normalised is not None:
            self._buffer.append(normalised)

    @staticmethod
    def _normalise_entry(entry: Any) -> dict | None:
        """Convert a raw ARTIQ log broadcast message into a dict.

        ARTIQ broadcasts log entries as 4-tuples ``(level, source, timestamp,
        message)`` (matching ``artiq.gui.log``'s callback format). Already-dict
        entries are passed through. Anything else is dropped.
        """
        if isinstance(entry, dict):
            return entry
        if isinstance(entry, (list, tuple)) and len(entry) == 4:
            level, source, timestamp, message = entry
            return {
                "level": level,
                "source": source,
                "timestamp": timestamp,
                "message": message,
            }
        return None
