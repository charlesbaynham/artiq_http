import asyncio
import logging
from typing import Dict, Optional

from sipyco.sync_struct import Subscriber

from ..config import config

logger = logging.getLogger(__name__)


class PersistentSubscriber:
    """Manages a persistent subscriber connection with automatic reconnection"""

    def __init__(self, notifier_name: str, host: str, port: int):
        self._notifier_name = notifier_name
        self._host = host
        self._port = port
        self._data: Dict = {}
        self._lock = asyncio.Lock()
        self._subscriber: Optional[Subscriber] = None
        self._reconnect_task: Optional[asyncio.Task] = None
        self._running = False
        self._connected = False
        self._initialized = False  # Track if we've received initial data
        self._init_event = asyncio.Event()  # Event to wait for initialization

    async def start(self):
        """Start the persistent subscriber"""
        if self._running:
            logger.warning("Subscriber %s already running", self._notifier_name)
            return

        self._running = True
        self._reconnect_task = asyncio.create_task(self._maintain_connection())
        logger.info("Started persistent subscriber for %s", self._notifier_name)

    async def stop(self):
        """Stop the persistent subscriber and cleanup"""
        if not self._running:
            return

        self._running = False

        # Cancel reconnection task
        if self._reconnect_task:
            self._reconnect_task.cancel()
            try:
                await self._reconnect_task
            except asyncio.CancelledError:
                pass

        # Close subscriber
        if self._subscriber:
            try:
                await self._subscriber.close()
            except Exception as e:
                logger.error("Error closing subscriber %s: %s", self._notifier_name, e)

        logger.info("Stopped persistent subscriber for %s", self._notifier_name)

    async def _maintain_connection(self):
        """Background task that maintains connection with auto-reconnect"""
        retry_delay = 10.0  # 10 second retry interval as specified

        while self._running:
            try:
                await self._connect()
                # If we get here, connection was successful
                # The subscriber will run until it disconnects
                # We'll be notified via disconnect callback
                while self._running and self._connected:
                    await asyncio.sleep(1)

                # If we're here, we disconnected
                if self._running:
                    logger.info(
                        "Subscriber %s disconnected, will retry in %.1fs",
                        self._notifier_name,
                        retry_delay,
                    )
                    await asyncio.sleep(retry_delay)

            except asyncio.CancelledError:
                # Task was cancelled, exit gracefully
                break
            except Exception as e:
                logger.error(
                    "Error in subscriber %s: %s, retrying in %.1fs",
                    self._notifier_name,
                    e,
                    retry_delay,
                )
                await asyncio.sleep(retry_delay)

    async def _connect(self):
        """Attempt to connect the subscriber"""
        try:
            # Close existing subscriber if any
            if self._subscriber:
                try:
                    await self._subscriber.close()
                except Exception:
                    pass

            # Create new subscriber
            def init_callback(data):
                """Called when subscriber receives initial data"""

                async def update_data():
                    async with self._lock:
                        self._data.clear()
                        self._data.update(data)
                        self._initialized = True
                        self._init_event.set()

                # Schedule the async update
                asyncio.create_task(update_data())
                return self._data

            def notify_callback(mod):
                """Called when subscriber receives updates"""
                # Updates are applied automatically to the dict we returned
                # from init_callback, so we don't need to do anything here
                pass

            def disconnect_callback():
                """Called when subscriber disconnects"""
                self._connected = False
                self._initialized = False
                self._init_event.clear()
                logger.warning("Subscriber %s disconnected", self._notifier_name)

            self._subscriber = Subscriber(
                self._notifier_name,
                target_builder=init_callback,
                notify_cb=notify_callback,
                disconnect_cb=disconnect_callback,
            )

            logger.info(
                "Connecting subscriber %s to %s:%d",
                self._notifier_name,
                self._host,
                self._port,
            )

            await self._subscriber.connect(self._host, self._port)
            self._connected = True
            logger.info("Subscriber %s connected successfully", self._notifier_name)

        except Exception as e:
            self._connected = False
            logger.error("Failed to connect subscriber %s: %s", self._notifier_name, e)
            raise

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        """
        Wait for the subscriber to receive initial data

        Args:
            timeout: Maximum time to wait in seconds

        Returns:
            True if initialized, False if timeout
        """
        try:
            await asyncio.wait_for(self._init_event.wait(), timeout=timeout)
            return True
        except asyncio.TimeoutError:
            return False

    def is_connected(self) -> bool:
        """Check if subscriber is currently connected and initialized"""
        return self._connected and self._initialized

    def get_data(self) -> Dict:
        """
        Get current data snapshot (thread-safe, non-blocking)

        Raises:
            RuntimeError: If subscriber is not connected/initialized
        """
        if not self._initialized:
            raise RuntimeError(f"Subscriber {self._notifier_name} not initialized")
        if not self._connected:
            raise RuntimeError(f"Subscriber {self._notifier_name} not connected")
        # Return a copy to prevent external modifications
        return dict(self._data)


class SubscriberManager:
    """Singleton manager for all persistent subscribers"""

    def __init__(self):
        self._subscribers: Dict[str, PersistentSubscriber] = {}
        self._started = False

    async def start(self):
        """Start all persistent subscribers"""
        if self._started:
            logger.warning("SubscriberManager already started")
            return

        host = config["host"]
        port = config["port_notifiers"]

        # Create subscribers for explist and explist_status
        self._subscribers["explist"] = PersistentSubscriber("explist", host, port)
        self._subscribers["explist_status"] = PersistentSubscriber("explist_status", host, port)

        # Create subscribers for schedule and datasets
        self._subscribers["schedule"] = PersistentSubscriber("schedule", host, port)
        self._subscribers["datasets"] = PersistentSubscriber("datasets", host, port)

        # Start all subscribers
        for subscriber in self._subscribers.values():
            await subscriber.start()

        self._started = True
        logger.info("SubscriberManager started with %d subscribers", len(self._subscribers))

    async def stop(self):
        """Stop all persistent subscribers"""
        if not self._started:
            return

        # Stop all subscribers
        for subscriber in self._subscribers.values():
            await subscriber.stop()

        self._subscribers.clear()
        self._started = False
        logger.info("SubscriberManager stopped")

    def get_explist(self) -> Dict:
        """Get current explist data

        Raises:
            RuntimeError: If subscriber is not connected/initialized
        """
        if "explist" not in self._subscribers:
            raise RuntimeError("explist subscriber not initialized")
        return self._subscribers["explist"].get_data()

    def get_explist_status(self) -> Dict:
        """Get current explist_status data

        Raises:
            RuntimeError: If subscriber is not connected/initialized
        """
        if "explist_status" not in self._subscribers:
            raise RuntimeError("explist_status subscriber not initialized")
        return self._subscribers["explist_status"].get_data()

    def get_schedule(self) -> Dict:
        """Get current schedule data

        Raises:
            RuntimeError: If subscriber is not connected/initialized
        """
        if "schedule" not in self._subscribers:
            raise RuntimeError("schedule subscriber not initialized")
        return self._subscribers["schedule"].get_data()

    def get_datasets(self) -> Dict:
        """Get current datasets data

        Raises:
            RuntimeError: If subscriber is not connected/initialized
        """
        if "datasets" not in self._subscribers:
            raise RuntimeError("datasets subscriber not initialized")
        return self._subscribers["datasets"].get_data()

    async def wait_for_init(self, timeout: float = 5.0) -> bool:
        """Wait for all subscribers to initialize

        Args:
            timeout: Maximum time to wait in seconds

        Returns:
            True if all initialized, False if any timeout
        """
        results = await asyncio.gather(
            *[sub.wait_for_init(timeout) for sub in self._subscribers.values()], return_exceptions=True
        )
        return all(r is True for r in results)


# Global singleton instance
subscriber_manager = SubscriberManager()
