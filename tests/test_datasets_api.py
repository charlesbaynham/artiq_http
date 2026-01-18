import pytest

# Mark all tests in this module as requiring a real ARTIQ server
pytestmark = pytest.mark.realserver


def test_get_dataset_names(client):
    """Test GET /api/datasets/names endpoint"""
    response = client.get("/api/datasets/names")
    assert response.status_code == 200
    data = response.json()

    assert "names" in data
    assert isinstance(data["names"], list)


def test_get_dataset_values_single(client):
    """Test GET /api/datasets/values with a single dataset"""
    # First, get the list of available datasets
    response = client.get("/api/datasets/names")
    assert response.status_code == 200
    names = response.json()["names"]

    if len(names) == 0:
        pytest.skip("No datasets available to test")

    # Request the first dataset
    test_name = names[0]
    response = client.get(f"/api/datasets/values?names={test_name}")
    assert response.status_code == 200
    data = response.json()

    assert test_name in data
    # ARTIQ datasets are in format [persist, value, metadata]
    assert isinstance(data[test_name], list)
    assert len(data[test_name]) == 3


def test_get_dataset_values_multiple(client):
    """Test GET /api/datasets/values with multiple datasets"""
    # First, get the list of available datasets
    response = client.get("/api/datasets/names")
    assert response.status_code == 200
    names = response.json()["names"]

    if len(names) < 2:
        pytest.skip("Not enough datasets available to test")

    # Request multiple datasets
    test_names = names[:2]
    names_param = ",".join(test_names)
    response = client.get(f"/api/datasets/values?names={names_param}")
    assert response.status_code == 200
    data = response.json()

    # Both datasets should be in the response
    for name in test_names:
        assert name in data


def test_get_dataset_values_nonexistent(client):
    """Test GET /api/datasets/values with non-existent dataset names"""
    response = client.get("/api/datasets/values?names=nonexistent_dataset_12345")
    assert response.status_code == 200
    data = response.json()

    # Should return empty dict for non-existent datasets
    assert data == {}


def test_get_dataset_values_mixed(client):
    """Test GET /api/datasets/values with mix of existent and non-existent datasets"""
    # Get a real dataset name
    response = client.get("/api/datasets/names")
    assert response.status_code == 200
    names = response.json()["names"]

    if len(names) == 0:
        pytest.skip("No datasets available to test")

    # Mix real and fake dataset names
    test_name = names[0]
    mixed_names = f"{test_name},fake_dataset_xyz"
    response = client.get(f"/api/datasets/values?names={mixed_names}")
    assert response.status_code == 200
    data = response.json()

    # Should only return the real dataset
    assert test_name in data
    assert "fake_dataset_xyz" not in data
