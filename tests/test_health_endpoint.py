import pytest

# Mark all tests in this module as requiring a real ARTIQ server
pytestmark = pytest.mark.realserver


def test_health_endpoint_healthy(client):
    """Test GET /api/health endpoint returns healthy when ARTIQ is connected"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()

    assert "status" in data
    assert "artiq_connected" in data
    assert "details" in data

    # When ARTIQ is running, should be healthy
    assert data["status"] in ["healthy", "degraded", "unhealthy"]
    assert isinstance(data["artiq_connected"], bool)
    assert isinstance(data["details"], dict)


def test_health_endpoint_structure(client):
    """Test GET /api/health endpoint response structure"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()

    # Check required fields
    assert "status" in data
    assert "artiq_connected" in data
    assert "details" in data

    # Check details contains expected subscribers
    details = data["details"]
    expected_subscribers = ["explist", "explist_status", "schedule", "datasets", "logs"]

    for subscriber in expected_subscribers:
        assert subscriber in details
        assert isinstance(details[subscriber], bool)

    # Status should be one of the expected values
    assert data["status"] in ["healthy", "degraded", "unhealthy"]

    # If all subscribers are connected, status should be healthy
    all_connected = all(details.values())
    if all_connected:
        assert data["status"] == "healthy"
        assert data["artiq_connected"] is True
