"""Persistent client for ARTIQ ``sipyco.broadcast`` channels.

Mirrors :class:`PersistentSubscriber` for sync_struct, but uses
:class:`sipyco.broadcast.Receiver`. Broadcasts have no init phase — they are a
live stream of messages — so "initialised" here means "TCP connection is up".
"""

import asyncio
import logging
from collections.abc import Callable
from typing import Any

from sipyco.broadcast import Receiver

logger = logging.getLogger(__name__)


class PersistentBroadcastReceiver:
    """Maintains a persistent broadcast subscription with auto-reconnect."""

    def __init__(self, broadcast_name: str, host: str, port: int):
        self._broadcast_name = broadcast_name
        self._host = host
        self._port = port
        self._receiver: Receiver | None = None
        self._reconnect_task: asyncio.Task | None = None
        self._running = False
        self._connected = False
        self._init_event = asyncio.Event()
        self._message_callbacks: list[Callable[[Any], None]] = []

    async def start(self) -> None:
        if self._running:
            logger.warning("Broadcast receiver %s already running", self._broadcast_name)
            return
        self._running = True
        self._reconnect_task = asyncio.create_task(self._maintain_connection())
        logger.info("Started broadcast receiver for %s", self._broadcast_name)

    async def stop(self) -> None:
        if not self._running:
            return
        self._running = False

        if self._reconnect_task:
            self._reconnect_task.cancel()
            try:
                await self._reconnect_task
            except asyncio.CancelledError:
                pass

        if self._receiver:
            try:
                await self._receiver.close()
            except Exception as e:
                logger.error("Error closing broadcast receiver %s: %s", self._broadcast_name, e)

        logger.info("Stopped broadcast receiver for %s", self._broadcast_name)

    async def _maintain_connection(self) -> None:
        retry_delay = 10.0

        while self._running:
            try:
                await self._connect()
                while self._running and self._connected:
                    await asyncio.sleep(1)

                if self._running:
                    logger.info(
                        "Broadcast receiver %s disconnected, will retry in %.1fs",
                        self._broadcast_name,
                        retry_delay,
                    )
                    await asyncio.sleep(retry_delay)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(
                    "Error in broadcast receiver %s: %s, retrying in %.1fs",
                    self._broadcast_name,
                    e,
                    retry_delay,
                )
                await asyncio.sleep(retry_delay)

    async def _connect(self) -> None:
        try:
            if self._receiver:
                try:
                    await self._receiver.close()
                except Exception:
                    pass

            def notify_callback(obj):
                self._notify_message_listeners(obj)

            def disconnect_callback():
                self._connected = False
                self._init_event.clear()
                logger.warning("Broadcast receiver %s disconnected", self._broadcast_name)

            self._receiver = Receiver(
                self._broadcast_name,
                notify_cb=notify_callback,
                disconnect_cb=disconnect_callback,
            )

            logger.info(
                "Connecting broadcast receiver %s to %s:%d",
                self._broadcast_name,
                self._host,
                self._port,
            )

            await self._receiver.connect(self._host, self._port)
            self._connected = True
            self._init_event.set()
            logger.info("Broadcast receiver %s connected successfully", self._broadcast_name)

        except Exception as e:
            self._connected = False
            logger.error("Failed to connect broadcast receiver %s: %s", self._broadcast_name, e)
            raise

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        """Wait until the receiver is connected (broadcasts have no init phase)."""
        try:
            await asyncio.wait_for(self._init_event.wait(), timeout=timeout)
            return True
        except TimeoutError:
            return False

    def is_connected(self) -> bool:
        return self._connected

    def register_message_callback(self, callback: Callable[[Any], None]) -> None:
        if callback not in self._message_callbacks:
            self._message_callbacks.append(callback)

    def unregister_message_callback(self, callback: Callable[[Any], None]) -> None:
        if callback in self._message_callbacks:
            self._message_callbacks.remove(callback)

    def _notify_message_listeners(self, obj: Any) -> None:
        for callback in self._message_callbacks:
            try:
                callback(obj)
            except Exception as e:
                logger.error(
                    "Error in broadcast message callback for %s: %s",
                    self._broadcast_name,
                    e,
                )
