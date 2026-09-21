import asyncio
import math
from typing import Any
from unittest.mock import patch

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from artiq_http import sse


class FakeDatasetsSubscriber:
    def __init__(self, data: dict[str, Any] | None = None, fail_get_data: bool = False):
        self._data = dict(data or {})
        self._fail_get_data = fail_get_data
        self._callbacks = []

    def register_change_callback(self, callback):
        self._callbacks.append(callback)

    def unregister_change_callback(self, callback):
        self._callbacks.remove(callback)

    def get_data(self) -> dict[str, Any]:
        if self._fail_get_data:
            raise RuntimeError("subscriber disconnected")
        return dict(self._data)

    def set_value(self, key: str, value: Any) -> None:
        self._data[key] = value

    def delete_value(self, key: str) -> None:
        self._data.pop(key, None)

    def emit(self, mod: dict[str, Any]) -> None:
        for callback in list(self._callbacks):
            callback(mod)


class FakeSubscriberManager:
    def __init__(self, subscriber: FakeDatasetsSubscriber | None = None, error: RuntimeError | None = None):
        self._subscriber = subscriber
        self._error = error

    def get_datasets_subscriber(self) -> FakeDatasetsSubscriber:
        if self._error is not None:
            raise self._error
        if self._subscriber is None:
            raise RuntimeError("datasets subscriber missing")
        return self._subscriber


def run_async(awaitable):
    return asyncio.run(awaitable)


def test_sanitize_for_json_handles_special_values():
    payload = {
        "nan": math.nan,
        "inf": math.inf,
        "nested": [1.0, -math.inf, {"ok": 2.0}],
    }

    assert sse.sanitize_for_json(payload) == {
        "nan": None,
        "inf": None,
        "nested": [1.0, None, {"ok": 2.0}],
    }


def test_format_sse_event_serializes_payload():
    assert sse.format_sse_event("update", {"key": [1, 2, 3]}) == 'event: update\ndata: {"key":[1,2,3]}\n\n'


def test_get_datasets_for_prefix_filters_matching_keys():
    datasets = {
        "ndscan.rid_1.points": [False, [1, 2], {}],
        "ndscan.rid_1.axis_0": [False, [0.1, 0.2], {}],
        "ndscan.rid_10.points": [False, [9, 9], {}],
        "other.prefix.value": [False, 42, {}],
    }

    assert sse.get_datasets_for_prefix(datasets, "ndscan.rid_1") == {
        "ndscan.rid_1.points": [False, [1, 2], {}],
        "ndscan.rid_1.axis_0": [False, [0.1, 0.2], {}],
    }


def test_stream_dataset_updates_emits_init_update_and_delete_events():
    subscriber = FakeDatasetsSubscriber(
        {
            "ndscan.rid_1.points": [False, [1, 2], {}],
            "other.prefix.value": [False, 42, {}],
        }
    )

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        try:
            with patch.object(
                sse.api.persistent_subscriber,
                "subscriber_manager",
                FakeSubscriberManager(subscriber=subscriber),
            ):
                init_event = await anext(stream)
                assert init_event == sse.format_sse_event(
                    "init",
                    {"ndscan.rid_1.points": [False, [1, 2], {}]},
                )
                assert len(subscriber._callbacks) == 1

                update_task = asyncio.create_task(anext(stream))
                subscriber.set_value("ndscan.rid_1.points", [False, [3, 4], {}])
                subscriber.emit({"action": "setitem", "key": "ndscan.rid_1.points"})
                assert await asyncio.wait_for(update_task, timeout=0.5) == sse.format_sse_event(
                    "update",
                    {"ndscan.rid_1.points": [False, [3, 4], {}]},
                )

                delete_task = asyncio.create_task(anext(stream))
                subscriber.delete_value("ndscan.rid_1.points")
                subscriber.emit({"action": "delitem", "key": "ndscan.rid_1.points"})
                assert await asyncio.wait_for(delete_task, timeout=0.5) == sse.format_sse_event(
                    "delete",
                    {"key": "ndscan.rid_1.points"},
                )
        finally:
            await stream.aclose()

        assert subscriber._callbacks == []

    run_async(scenario())


def test_stream_dataset_updates_ignores_irrelevant_changes():
    subscriber = FakeDatasetsSubscriber({"ndscan.rid_1.points": [False, [1], {}]})

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        try:
            with patch.object(
                sse.api.persistent_subscriber,
                "subscriber_manager",
                FakeSubscriberManager(subscriber=subscriber),
            ):
                await anext(stream)
                next_event = asyncio.create_task(anext(stream))
                subscriber.emit({"action": "setitem", "key": "other.prefix.value"})

                try:
                    await asyncio.wait_for(asyncio.shield(next_event), timeout=0.1)
                except TimeoutError:
                    pass
                else:
                    raise AssertionError("Irrelevant dataset change should not emit an SSE event")

                next_event.cancel()
                try:
                    await next_event
                except (asyncio.CancelledError, StopAsyncIteration):
                    pass
        finally:
            await stream.aclose()

    run_async(scenario())


def test_stream_dataset_updates_emits_heartbeat_on_timeout():
    subscriber = FakeDatasetsSubscriber({"ndscan.rid_1.points": [False, [1], {}]})

    async def fake_wait_for(awaitable, timeout):
        awaitable.close()
        raise TimeoutError

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        try:
            with (
                patch.object(
                    sse.api.persistent_subscriber,
                    "subscriber_manager",
                    FakeSubscriberManager(subscriber=subscriber),
                ),
                patch("artiq_http.sse.asyncio.wait_for", side_effect=fake_wait_for),
            ):
                await anext(stream)
                assert await anext(stream) == sse.format_sse_event("heartbeat", {})
        finally:
            await stream.aclose()

    run_async(scenario())


def test_stream_dataset_updates_emits_error_when_subscriber_is_unavailable():
    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        with patch.object(
            sse.api.persistent_subscriber,
            "subscriber_manager",
            FakeSubscriberManager(error=RuntimeError("datasets subscriber not initialized")),
        ):
            assert await anext(stream) == sse.format_sse_event(
                "error",
                {"message": "datasets subscriber not initialized"},
            )

    run_async(scenario())


def test_stream_dataset_updates_emits_error_when_initial_snapshot_fails():
    subscriber = FakeDatasetsSubscriber(fail_get_data=True)

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        with patch.object(
            sse.api.persistent_subscriber,
            "subscriber_manager",
            FakeSubscriberManager(subscriber=subscriber),
        ):
            assert await anext(stream) == sse.format_sse_event(
                "error",
                {"message": "Failed to get initial data: subscriber disconnected"},
            )

    run_async(scenario())


def test_stream_dataset_updates_emits_error_when_connection_is_lost_after_init():
    subscriber = FakeDatasetsSubscriber({"ndscan.rid_1.points": [False, [1], {}]})

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        try:
            with patch.object(
                sse.api.persistent_subscriber,
                "subscriber_manager",
                FakeSubscriberManager(subscriber=subscriber),
            ):
                await anext(stream)
                next_event = asyncio.create_task(anext(stream))
                subscriber._fail_get_data = True
                subscriber.emit({"action": "setitem", "key": "ndscan.rid_1.points"})
                assert await asyncio.wait_for(next_event, timeout=0.5) == sse.format_sse_event(
                    "error",
                    {"message": "Connection lost"},
                )
        finally:
            await stream.aclose()

    run_async(scenario())


def test_stream_datasets_endpoint_returns_event_stream_response():
    app = FastAPI()
    app.include_router(sse.router, prefix="/api")

    async def fake_stream(prefix: str):
        assert prefix == "ndscan.rid_1"
        yield sse.format_sse_event("init", {"ndscan.rid_1.points": [False, [1], {}]})

    with patch("artiq_http.sse.stream_dataset_updates", side_effect=fake_stream), TestClient(app) as client:
        with client.stream("GET", "/api/datasets/stream/ndscan.rid_1") as response:
            body = "".join(response.iter_text())

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")
    assert response.headers["cache-control"] == "no-cache"
    assert response.headers["connection"] == "keep-alive"
    assert response.headers["x-accel-buffering"] == "no"
    assert body == sse.format_sse_event("init", {"ndscan.rid_1.points": [False, [1], {}]})


def test_sanitize_for_json_handles_numpy_types():
    np = pytest.importorskip("numpy")

    payload = {
        "arr": np.array([1, 2, 3]),
        "int": np.int64(42),
        "float": np.float64(3.14),
        "bool": np.bool_(True),
        "nested": {"arr": np.array([[1, 2], [3, 4]])},
    }

    assert sse.sanitize_for_json(payload) == {
        "arr": [1, 2, 3],
        "int": 42,
        "float": 3.14,
        "bool": True,
        "nested": {"arr": [[1, 2], [3, 4]]},
    }


def test_sanitize_for_json_converts_numpy_nan_and_inf_to_none():
    np = pytest.importorskip("numpy")

    payload = {
        "nan": np.float64(float("nan")),
        "inf": np.float32(float("inf")),
        "neg_inf": np.float16(float("-inf")),
    }

    result = sse.sanitize_for_json(payload)
    assert result["nan"] is None
    assert result["inf"] is None
    assert result["neg_inf"] is None


def test_stream_dataset_updates_emits_init_with_empty_data_when_no_match():
    subscriber = FakeDatasetsSubscriber({"other.prefix.value": [False, 42, {}]})

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        with patch.object(
            sse.api.persistent_subscriber,
            "subscriber_manager",
            FakeSubscriberManager(subscriber=subscriber),
        ):
            event = await anext(stream)
            assert event == sse.format_sse_event("init", {})

        await stream.aclose()

    run_async(scenario())


def test_stream_dataset_updates_emits_update_on_init_action():
    subscriber = FakeDatasetsSubscriber({"ndscan.rid_1.points": [False, [1], {}]})

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        try:
            with patch.object(
                sse.api.persistent_subscriber,
                "subscriber_manager",
                FakeSubscriberManager(subscriber=subscriber),
            ):
                await anext(stream)

                update_task = asyncio.create_task(anext(stream))
                subscriber.set_value("ndscan.rid_1.points", [False, [2, 3], {}])
                subscriber.emit({"action": "init", "key": "ndscan.rid_1.points"})
                assert await asyncio.wait_for(update_task, timeout=0.5) == sse.format_sse_event(
                    "update",
                    {"ndscan.rid_1.points": [False, [2, 3], {}]},
                )
        finally:
            await stream.aclose()

    run_async(scenario())


def test_stream_dataset_updates_breaks_on_cancelled_error():
    subscriber = FakeDatasetsSubscriber({"ndscan.rid_1.points": [False, [1], {}]})

    async def fake_wait_for(*args, **kwargs):
        raise asyncio.CancelledError

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        with (
            patch.object(
                sse.api.persistent_subscriber,
                "subscriber_manager",
                FakeSubscriberManager(subscriber=subscriber),
            ),
            patch("artiq_http.sse.asyncio.wait_for", side_effect=fake_wait_for),
        ):
            await anext(stream)
            assert len(subscriber._callbacks) == 1

            # The next anext triggers CancelledError inside the generator loop
            with pytest.raises(StopAsyncIteration):
                await anext(stream)

        # Callback should be cleaned up
        assert subscriber._callbacks == []

    run_async(scenario())


def test_stream_dataset_updates_emits_error_on_unexpected_exception():
    subscriber = FakeDatasetsSubscriber({"ndscan.rid_1.points": [False, [1], {}]})

    async def fake_wait_for(*args, **kwargs):
        raise ValueError("boom")

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        try:
            with (
                patch.object(
                    sse.api.persistent_subscriber,
                    "subscriber_manager",
                    FakeSubscriberManager(subscriber=subscriber),
                ),
                patch("artiq_http.sse.asyncio.wait_for", side_effect=fake_wait_for),
            ):
                await anext(stream)
                event = await anext(stream)
                assert event == sse.format_sse_event("error", {"message": "boom"})

                # Generator should be exhausted after error
                with pytest.raises(StopAsyncIteration):
                    await anext(stream)
        finally:
            await stream.aclose()

    run_async(scenario())


def test_stream_dataset_updates_queues_multiple_rapid_updates():
    subscriber = FakeDatasetsSubscriber({"ndscan.rid_1.points": [False, [1], {}]})

    async def scenario():
        stream = sse.stream_dataset_updates("ndscan.rid_1")
        try:
            with patch.object(
                sse.api.persistent_subscriber,
                "subscriber_manager",
                FakeSubscriberManager(subscriber=subscriber),
            ):
                await anext(stream)

                # Emit, process, emit, process — tests that the queue drains
                subscriber.set_value("ndscan.rid_1.points", [False, [2], {}])
                subscriber.emit({"action": "setitem", "key": "ndscan.rid_1.points"})
                event1 = await asyncio.wait_for(anext(stream), timeout=0.5)

                subscriber.set_value("ndscan.rid_1.points", [False, [3], {}])
                subscriber.emit({"action": "setitem", "key": "ndscan.rid_1.points"})
                event2 = await asyncio.wait_for(anext(stream), timeout=0.5)

                subscriber.set_value("ndscan.rid_1.points", [False, [4], {}])
                subscriber.emit({"action": "setitem", "key": "ndscan.rid_1.points"})
                event3 = await asyncio.wait_for(anext(stream), timeout=0.5)

                assert event1 == sse.format_sse_event("update", {"ndscan.rid_1.points": [False, [2], {}]})
                assert event2 == sse.format_sse_event("update", {"ndscan.rid_1.points": [False, [3], {}]})
                assert event3 == sse.format_sse_event("update", {"ndscan.rid_1.points": [False, [4], {}]})
        finally:
            await stream.aclose()

    run_async(scenario())
