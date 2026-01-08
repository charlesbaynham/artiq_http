from fastapi.testclient import TestClient

from artiq_http.main import fastapi_app

client = TestClient(fastapi_app)


def test_read_main():
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_schedule():
    response = client.get("/api/schedule")
    assert response.status_code == 200


def test_devices():
    response = client.get("/api/devices")
    assert response.status_code == 200


def test_datasets():
    response = client.get("/api/datasets")
    assert response.status_code == 200
