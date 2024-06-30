from fastapi.testclient import TestClient

from artiq_http.main import fastapi_app

client = TestClient(fastapi_app)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_schedule():
    response = client.get("/schedule")
    assert response.status_code == 200


def test_devices():
    response = client.get("/devices")
    assert response.status_code == 200


def test_datasets():
    response = client.get("/datasets")
    assert response.status_code == 200
