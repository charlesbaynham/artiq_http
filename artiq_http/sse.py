"""
SSE (Server-Sent Events) streaming for real-time dataset updates.

This module provides an SSE endpoint for streaming NDScan dataset updates
to the frontend in real-time, replacing polling-based approaches.
"""

import asyncio
import json
import logging
import math
from typing import Any, Dict, Set

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from . import artiq_api as api

logger = logging.getLogger(__name__)

router = APIRouter()


def sanitize_for_json(obj: Any) -> Any:
    """Recursively sanitize values to be JSON compliant"""
    try:
        import numpy as np

        has_numpy = True
    except ImportError:
        has_numpy = False

    if isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [sanitize_for_json(item) for item in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif has_numpy and isinstance(obj, np.ndarray):
        return sanitize_for_json(obj.tolist())
    elif has_numpy and isinstance(
        obj, (np.integer, np.int8, np.int16, np.int32, np.int64, np.uint8, np.uint16, np.uint32, np.uint64)
    ):
        return int(obj)
    elif has_numpy and isinstance(obj, (np.floating, np.float16, np.float32, np.float64)):
        value = float(obj)
        if math.isnan(value) or math.isinf(value):
            return None
        return value
    elif has_numpy and isinstance(obj, np.bool_):
        return bool(obj)
    return obj


def format_sse_event(event: str, data: Any) -> str:
    """Format a single SSE event"""
    json_data = json.dumps(sanitize_for_json(data), separators=(",", ":"))
    return f"event: {event}\ndata: {json_data}\n\n"


def get_datasets_for_prefix(all_datasets: Dict, prefix: str) -> Dict:
    """Extract datasets that match the given prefix"""
    return {key: value for key, value in all_datasets.items() if key.startswith(prefix + ".")}


async def stream_dataset_updates(prefix: str):
    """
    Generator that streams dataset updates for a given prefix.

    Yields SSE events:
    - init: Full dataset state on connection
    - update: Changed datasets
    - heartbeat: Keep-alive (every 15 seconds)
    """
    update_queue: asyncio.Queue = asyncio.Queue()
    relevant_keys: Set[str] = set()

    def on_dataset_change(mod: Dict):
        """Callback when datasets change"""
        # Check if this modification is relevant to our prefix
        # The mod dict contains action, path, and possibly key/value
        key = mod.get("key")

        if key and key.startswith(prefix + "."):
            # This is a relevant change, queue it
            try:
                update_queue.put_nowait(mod)
            except asyncio.QueueFull:
                logger.warning("Update queue full for prefix %s", prefix)

    # Get the datasets subscriber and register callback
    try:
        datasets_subscriber = api.persistent_subscriber.subscriber_manager.get_datasets_subscriber()
        datasets_subscriber.register_change_callback(on_dataset_change)
    except RuntimeError as e:
        yield format_sse_event("error", {"message": str(e)})
        return

    try:
        # Send initial state
        try:
            all_datasets = datasets_subscriber.get_data()
            initial_data = get_datasets_for_prefix(all_datasets, prefix)
            relevant_keys.update(initial_data.keys())

            if initial_data:
                yield format_sse_event("init", initial_data)
            else:
                yield format_sse_event("init", {})
        except RuntimeError as e:
            yield format_sse_event("error", {"message": f"Failed to get initial data: {e}"})
            return

        # Stream updates
        heartbeat_interval = 15.0  # seconds

        while True:
            try:
                # Wait for updates with timeout for heartbeat
                try:
                    mod = await asyncio.wait_for(update_queue.get(), timeout=heartbeat_interval)

                    # Process the modification
                    key = mod.get("key")
                    action = mod.get("action")

                    if action in ("setitem", "init"):
                        # Get the current value for this key
                        try:
                            current_data = datasets_subscriber.get_data()
                            if key in current_data:
                                update_data = {key: current_data[key]}
                                relevant_keys.add(key)
                                yield format_sse_event("update", update_data)
                        except RuntimeError:
                            # Subscriber disconnected
                            yield format_sse_event("error", {"message": "Connection lost"})
                            return
                    elif action == "delitem":
                        relevant_keys.discard(key)
                        yield format_sse_event("delete", {"key": key})

                except asyncio.TimeoutError:
                    # Send heartbeat
                    yield format_sse_event("heartbeat", {})

            except asyncio.CancelledError:
                logger.info("SSE stream cancelled for prefix %s", prefix)
                break
            except Exception as e:
                logger.error("Error in SSE stream for %s: %s", prefix, e)
                yield format_sse_event("error", {"message": str(e)})
                break

    finally:
        # Cleanup: unregister callback
        datasets_subscriber.unregister_change_callback(on_dataset_change)
        logger.info("SSE stream closed for prefix %s", prefix)


@router.get("/datasets/stream/{prefix:path}")
async def stream_datasets(prefix: str):
    """
    SSE endpoint for streaming dataset updates for a specific prefix.

    The prefix should be an NDScan prefix like "ndscan.rid_1".

    Events:
    - init: Full dataset state for the prefix
    - update: Individual dataset updates
    - delete: Dataset removed
    - heartbeat: Keep-alive signal
    - error: Error occurred
    """
    logger.info("SSE connection opened for prefix: %s", prefix)

    return StreamingResponse(
        stream_dataset_updates(prefix),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering if present
        },
    )
