"""Ring-buffered subscriber for ARTIQ's ``log`` notifier."""

import collections
import logging
from typing import Any, Dict, List, Optional

from .persistent_subscriber import PersistentSubscriber

logger = logging.getLogger(__name__)

DEFAULT_MAX_LOG_ENTRIES = 1000


class LogBuffer:
    """Maintain a bounded ring buffer of ARTIQ log entries.

    Wraps a :class:`PersistentSubscriber` for the ``log`` notifier (a list-typed
    notifier) and registers a change callback so that newly appended entries
    are normalised into dicts and pushed into a ``deque(maxlen=...)``.
    """

    def __init__(
        self,
        host: str,
        port: int,
        max_entries: int = DEFAULT_MAX_LOG_ENTRIES,
    ):
        self._subscriber = PersistentSubscriber("log", host, port, data_factory=list)
        # asyncio-only: _handle_change and get_logs must run on the same event loop;
        # concurrent access from threads is not supported.
        self._buffer: collections.deque = collections.deque(maxlen=max_entries)
        self._subscriber.register_change_callback(self._handle_change)

    async def start(self) -> None:
        await self._subscriber.start()

    async def stop(self) -> None:
        self._subscriber.unregister_change_callback(self._handle_change)
        await self._subscriber.stop()

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        return await self._subscriber.wait_for_init(timeout)

    def is_ready(self) -> bool:
        """True when the underlying subscriber has received initial data."""
        return self._subscriber.is_initialized()

    def is_connected(self) -> bool:
        """Delegates to the underlying subscriber."""
        return self._subscriber.is_connected()

    def get_logs(self) -> List[Dict]:
        """Return a copy of the current buffered log entries."""
        return list(self._buffer)

    def _handle_change(self, mod: Dict) -> None:
        action = mod.get("action")
        if action == "init":
            self._buffer.clear()
            self._add_entries(mod.get("struct"))
        elif action == "append" and not mod.get("path"):
            self._add_entries([mod.get("x")])
        # Other mods (setitem, delitem, pop, insert) are ignored — the log
        # notifier only ever appends to a top-level list.

    def _add_entries(self, raw: Any) -> None:
        """Normalise ARTIQ log notifier data into entry dicts and append them."""
        if raw is None:
            return
        if isinstance(raw, dict):
            normalised = self._normalise_entry(raw)
            if normalised is not None:
                self._buffer.append(normalised)
            return
        if isinstance(raw, (list, tuple)):
            if not raw:
                return
            # If every item is itself a tuple/list/dict, treat ``raw`` as a
            # collection of entries; otherwise treat ``raw`` itself as a single
            # entry encoded as a tuple.
            if all(isinstance(item, (list, tuple, dict)) for item in raw):
                for item in raw:
                    normalised = self._normalise_entry(item)
                    if normalised is not None:
                        self._buffer.append(normalised)
            else:
                normalised = self._normalise_entry(raw)
                if normalised is not None:
                    self._buffer.append(normalised)

    @staticmethod
    def _normalise_entry(entry: Any) -> Optional[Dict]:
        """Convert a raw ARTIQ log entry into a dict.

        ARTIQ broadcasts log entries as 4-tuples ``(level, source, time,
        message)``. Already-dict entries are passed through. Anything else is
        dropped.
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
