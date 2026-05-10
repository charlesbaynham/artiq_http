import asyncio
import json
from unittest.mock import MagicMock, patch

import numpy as np
import pytest

from artiq_http import sse


class TestSanitizeForJson:
    def test_simple_values_unchanged(self):
        assert sse.sanitize_for_json(42) == 42
        assert sse.sanitize_for_json("hello") == "hello"
        assert sse.sanitize_for_json(None) is None
        assert sse.sanitize_for_json(True) is True
        assert sse.sanitize_for_json([1, 2, 3]) == [1, 2, 3]

    def test_float_nan_inf(self):
        assert sse.sanitize_for_json(float("nan")) is None
        assert sse.sanitize_for_json(float("inf")) is None
        assert sse.sanitize_for_json(float("-inf")) is None
        assert sse.sanitize_for_json(3.14) == 3.14
        assert sse.sanitize_for_json(-0.0) == -0.0

    def test_numpy_array(self):
        arr = np.array([1, 2, 3])
        assert sse.sanitize_for_json(arr) == [1, 2, 3]

    def test_numpy_2d_array(self):
        arr = np.array([[1, 2], [3, 4]])
        assert sse.sanitize_for_json(arr) == [[1, 2], [3, 4]]

    def test_numpy_scalars(self):
        assert sse.sanitize_for_json(np.int32(42)) == 42
        assert sse.sanitize_for_json(np.int64(42)) == 42
        assert sse.sanitize_for_json(np.uint8(255)) == 255
        assert sse.sanitize_for_json(np.uint64(12345678901234)) == 12345678901234
        assert sse.sanitize_for_json(np.float32(3.14)) == pytest.approx(3.14)
        assert sse.sanitize_for_json(np.float64(3.14)) == pytest.approx(3.14)
        assert sse.sanitize_for_json(np.bool_(True)) is True
        assert sse.sanitize_for_json(np.bool_(False)) is False

    def test_numpy_nan_inf(self):
        assert sse.sanitize_for_json(np.float32("nan")) is None
        assert sse.sanitize_for_json(np.float64("inf")) is None
        assert sse.sanitize_for_json(np.float64("-inf")) is None

    def test_nested_dict(self):
        data = {
            "arr": np.array([1, 2]),
            "nested": {
                "value": np.int64(42),
                "nan": float("nan"),
            },
            "list": [np.float32(1.5), np.bool_(False)],
        }
        expected = {
            "arr": [1, 2],
            "nested": {
                "value": 42,
                "nan": None,
            },
            "list": [pytest.approx(1.5), False],
        }
        result = sse.sanitize_for_json(data)
        assert result["arr"] == expected["arr"]
        assert result["nested"]["value"] == expected["nested"]["value"]
        assert result["nested"]["nan"] is None
        assert result["list"][0] == pytest.approx(1.5)
        assert result["list"][1] is False

    def test_tuple_becomes_list(self):
        assert sse.sanitize_for_json((1, 2, 3)) == [1, 2, 3]

    def test_mixed_nested_structure(self):
        data = {
            "tuple_with_array": (np.array([1, 2]),),
            "dict_list": [{"val": np.int32(5)}],
        }
        result = sse.sanitize_for_json(data)
        assert result["tuple_with_array"] == [[1, 2]]
        assert result["dict_list"] == [{"val": 5}]


class TestFormatSSEEvent:
    def test_simple_event(self):
        result = sse.format_sse_event("init", {"key": "value"})
        assert result == 'event: init\ndata: {"key":"value"}\n\n'

    def test_heartbeat(self):
        result = sse.format_sse_event("heartbeat", {})
        assert result == 'event: heartbeat\ndata: {}\n\n'

    def test_update_event(self):
        result = sse.format_sse_event("update", {"ndscan.rid_1.points": [1, 2]})
        assert result == 'event: update\ndata: {"ndscan.rid_1.points":[1,2]}\n\n'

    def test_delete_event(self):
        result = sse.format_sse_event("delete", {"key": "ndscan.rid_1.points"})
        assert result == 'event: delete\ndata: {"key":"ndscan.rid_1.points"}\n\n'

    def test_error_event(self):
        result = sse.format_sse_event("error", {"message": "Connection lost"})
        assert result == 'event: error\ndata: {"message":"Connection lost"}\n\n'

    def test_multiline_data(self):
        result = sse.format_sse_event("init", {"text": "line1\nline2"})
        assert 'event: init' in result
        assert '"text":"line1\\nline2"' in result


class TestGetDatasetsForPrefix:
    def test_matching_prefix(self):
        datasets = {
            "ndscan.rid_1.points": [1, 2, 3],
            "ndscan.rid_1.axes": ["x", "y"],
            "ndscan.rid_2.points": [4, 5, 6],
            "other.data": "value",
        }
        result = sse.get_datasets_for_prefix(datasets, "ndscan.rid_1")
        assert result == {
            "ndscan.rid_1.points": [1, 2, 3],
            "ndscan.rid_1.axes": ["x", "y"],
        }

    def test_no_matches(self):
        datasets = {"other.data": "value"}
        result = sse.get_datasets_for_prefix(datasets, "ndscan.rid_1")
        assert result == {}

    def test_empty_datasets(self):
        assert sse.get_datasets_for_prefix({}, "ndscan.rid_1") == {}

    def test_prefix_with_dot(self):
        datasets = {
            "ndscan.rid_1.points": [1],
            "ndscan.rid_10.points": [2],
        }
        result = sse.get_datasets_for_prefix(datasets, "ndscan.rid_1")
        assert result == {"ndscan.rid_1.points": [1]}

    def test_all_match(self):
        datasets = {
            "ndscan.rid_1.a": 1,
            "ndscan.rid_1.b": 2,
        }
        result = sse.get_datasets_for_prefix(datasets, "ndscan.rid_1")
        assert len(result) == 2

    def test_exact_key_not_matched_without_dot(self):
        datasets = {
            "ndscan.rid_1": "value",
        }
        result = sse.get_datasets_for_prefix(datasets, "ndscan.rid_1")
        assert result == {}


@pytest.fixture
def mock_datasets_subscriber():
    """Create a mock datasets subscriber that captures registered callbacks."""
    subscriber = MagicMock()
    subscriber.get_data.return_value = {}
    callbacks = []

    def register_callback(cb):
        callbacks.append(cb)

    def unregister_callback(cb):
        if cb in callbacks:
            callbacks.remove(cb)

    subscriber.register_change_callback = register_callback
    subscriber.unregister_change_callback = unregister_callback
    subscriber._callbacks = callbacks
    return subscriber


class TestStreamDatasetUpdates:
    @pytest.mark.anyio
    async def test_init_event_with_data(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.return_value = {
            "ndscan.rid_1.points": [1, 2, 3],
            "ndscan.rid_1.axes": ["x", "y"],
        }

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)

            assert "event: init" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert "ndscan.rid_1.points" in data
            assert data["ndscan.rid_1.points"] == [1, 2, 3]
            assert "ndscan.rid_1.axes" in data

    @pytest.mark.anyio
    async def test_init_event_empty(self, mock_datasets_subscriber):
        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)

            assert "event: init" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert data == {}

    @pytest.mark.anyio
    async def test_update_event_setitem(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.return_value = {
            "ndscan.rid_1.points": [1, 2, 3],
        }

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")

            # Get init event
            await stream.asend(None)

            # Trigger an update
            mock_datasets_subscriber.get_data.return_value = {
                "ndscan.rid_1.points": [1, 2, 3, 4],
            }
            for cb in mock_datasets_subscriber._callbacks:
                cb({"action": "setitem", "key": "ndscan.rid_1.points"})

            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)
            assert "event: update" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert data["ndscan.rid_1.points"] == [1, 2, 3, 4]

    @pytest.mark.anyio
    async def test_update_event_init_action(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.return_value = {
            "ndscan.rid_1.points": [1],
        }

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")
            await stream.asend(None)

            mock_datasets_subscriber.get_data.return_value = {
                "ndscan.rid_1.points": [1, 2],
            }
            for cb in mock_datasets_subscriber._callbacks:
                cb({"action": "init", "key": "ndscan.rid_1.points"})

            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)
            assert "event: update" in event

    @pytest.mark.anyio
    async def test_delete_event(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.return_value = {
            "ndscan.rid_1.points": [1, 2, 3],
        }

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")

            # Get init event
            await stream.asend(None)

            # Trigger a delete
            for cb in mock_datasets_subscriber._callbacks:
                cb({"action": "delitem", "key": "ndscan.rid_1.points"})

            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)
            assert "event: delete" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert data["key"] == "ndscan.rid_1.points"

    @pytest.mark.anyio
    async def test_heartbeat_after_timeout(self, mock_datasets_subscriber):
        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ), patch.object(sse, "HEARTBEAT_INTERVAL", 0.01):
            stream = sse.stream_dataset_updates("ndscan.rid_1")

            # Get init event
            await stream.asend(None)

            # Wait for heartbeat (no updates sent)
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)
            assert "event: heartbeat" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert data == {}

    @pytest.mark.anyio
    async def test_unrelated_updates_ignored(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.return_value = {
            "ndscan.rid_1.points": [1, 2, 3],
        }

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ), patch.object(sse, "HEARTBEAT_INTERVAL", 0.01):
            stream = sse.stream_dataset_updates("ndscan.rid_1")

            # Get init event
            await stream.asend(None)

            # Trigger an update for unrelated key
            for cb in mock_datasets_subscriber._callbacks:
                cb({"action": "setitem", "key": "ndscan.rid_2.points"})

            # Should get heartbeat instead of update (since unrelated)
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)
            assert "event: heartbeat" in event

    @pytest.mark.anyio
    async def test_update_without_key_ignored(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.return_value = {
            "ndscan.rid_1.points": [1, 2, 3],
        }

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ), patch.object(sse, "HEARTBEAT_INTERVAL", 0.01):
            stream = sse.stream_dataset_updates("ndscan.rid_1")

            # Get init event
            await stream.asend(None)

            # Trigger an update without a key
            for cb in mock_datasets_subscriber._callbacks:
                cb({"action": "setitem"})

            # Should get heartbeat instead
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)
            assert "event: heartbeat" in event

    @pytest.mark.anyio
    async def test_cleanup_on_cancel(self, mock_datasets_subscriber):
        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")

            # Get init event
            await stream.asend(None)
            assert len(mock_datasets_subscriber._callbacks) == 1

            # Close the stream
            await stream.aclose()

            # Callback should be unregistered
            assert len(mock_datasets_subscriber._callbacks) == 0

    @pytest.mark.anyio
    async def test_error_when_subscriber_not_initialized(self):
        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            side_effect=RuntimeError("Subscriber not initialized"),
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)

            assert "event: error" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert "Subscriber not initialized" in data["message"]

            with pytest.raises(StopAsyncIteration):
                await stream.asend(None)

    @pytest.mark.anyio
    async def test_error_on_get_data_failure(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.side_effect = RuntimeError("Connection lost")

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)

            assert "event: error" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert "Failed to get initial data" in data["message"]

            with pytest.raises(StopAsyncIteration):
                await stream.asend(None)

    @pytest.mark.anyio
    async def test_error_on_subscriber_disconnect_during_update(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.side_effect = [{
            "ndscan.rid_1.points": [1],
        }, RuntimeError("Subscriber disconnected")]

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")

            # Get init event
            await stream.asend(None)

            # Trigger an update, but subscriber fails
            for cb in mock_datasets_subscriber._callbacks:
                cb({"action": "setitem", "key": "ndscan.rid_1.points"})

            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)
            assert "event: error" in event
            data = json.loads(event.split("data: ", 1)[1])
            assert "Connection lost" in data["message"]

            with pytest.raises(StopAsyncIteration):
                await stream.asend(None)

    @pytest.mark.anyio
    async def test_multiple_callbacks_can_register(self, mock_datasets_subscriber):
        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream1 = sse.stream_dataset_updates("ndscan.rid_1")
            stream2 = sse.stream_dataset_updates("ndscan.rid_2")

            await stream1.asend(None)
            await stream2.asend(None)

            assert len(mock_datasets_subscriber._callbacks) == 2

            await stream1.aclose()
            assert len(mock_datasets_subscriber._callbacks) == 1

            await stream2.aclose()
            assert len(mock_datasets_subscriber._callbacks) == 0

    @pytest.mark.anyio
    async def test_numpy_data_in_event(self, mock_datasets_subscriber):
        mock_datasets_subscriber.get_data.return_value = {
            "ndscan.rid_1.points": np.array([1.0, 2.0, float("nan")]),
            "ndscan.rid_1.count": np.int64(42),
        }

        with patch.object(
            sse.api.persistent_subscriber.subscriber_manager,
            "get_datasets_subscriber",
            return_value=mock_datasets_subscriber,
        ):
            stream = sse.stream_dataset_updates("ndscan.rid_1")
            event = await asyncio.wait_for(stream.asend(None), timeout=1.0)

            data = json.loads(event.split("data: ", 1)[1])
            assert data["ndscan.rid_1.points"] == [1.0, 2.0, None]
            assert data["ndscan.rid_1.count"] == 42


class TestSSEEndpoint:
    def test_sse_endpoint_success(self, client):
        """Test SSE endpoint returns correct headers and initial event."""

        async def mock_stream(prefix):
            yield sse.format_sse_event("init", {"ndscan.rid_1.points": [1, 2, 3]})

        with patch.object(sse, "stream_dataset_updates", mock_stream):
            with client.stream("GET", "/api/datasets/stream/ndscan.rid_1") as response:
                assert response.status_code == 200
                assert response.headers["content-type"] == "text/event-stream; charset=utf-8"
                assert response.headers["cache-control"] == "no-cache"
                assert response.headers["x-accel-buffering"] == "no"

                # Read the complete finite stream
                lines = list(response.iter_lines())

                assert any("event: init" in line for line in lines)
                assert any('"ndscan.rid_1.points"' in line for line in lines)

    def test_sse_endpoint_empty_prefix(self, client):
        """Test SSE endpoint handles empty prefix (all datasets)."""

        async def mock_stream(prefix):
            yield sse.format_sse_event("init", {})

        with patch.object(sse, "stream_dataset_updates", mock_stream):
            with client.stream("GET", "/api/datasets/stream/") as response:
                assert response.status_code == 200

                lines = list(response.iter_lines())
                assert any("event: init" in line for line in lines)

    def test_sse_endpoint_nested_prefix(self, client):
        """Test SSE endpoint handles nested prefix with path parameter."""

        async def mock_stream(prefix):
            yield sse.format_sse_event("init", {"ndscan.rid_1.subscan.points": [1, 2]})

        with patch.object(sse, "stream_dataset_updates", mock_stream):
            with client.stream("GET", "/api/datasets/stream/ndscan.rid_1.subscan") as response:
                assert response.status_code == 200

                lines = list(response.iter_lines())
                assert any("event: init" in line for line in lines)
                assert any('"ndscan.rid_1.subscan.points"' in line for line in lines)

    def test_sse_endpoint_error_when_subscriber_unavailable(self, client):
        """Test SSE endpoint returns error event when subscriber is not available."""

        async def mock_stream(prefix):
            yield sse.format_sse_event("error", {"message": "Subscriber not initialized"})

        with patch.object(sse, "stream_dataset_updates", mock_stream):
            with client.stream("GET", "/api/datasets/stream/ndscan.rid_1") as response:
                assert response.status_code == 200

                lines = list(response.iter_lines())
                assert any("event: error" in line for line in lines)
                assert any("Subscriber not initialized" in line for line in lines)

    def test_sse_endpoint_prefix_passed_to_generator(self, client):
        """Test that the prefix parameter is passed to the stream generator."""
        captured_prefixes = []

        async def mock_stream(prefix):
            captured_prefixes.append(prefix)
            yield sse.format_sse_event("init", {})

        with patch.object(sse, "stream_dataset_updates", mock_stream):
            with client.stream("GET", "/api/datasets/stream/ndscan.rid_1") as response:
                assert response.status_code == 200
                list(response.iter_lines())

        assert captured_prefixes == ["ndscan.rid_1"]
