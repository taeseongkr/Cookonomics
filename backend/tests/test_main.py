from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "docs" in data


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "cookonomics-backend"


def test_openapi_docs():
    response = client.get("/docs")
    assert response.status_code == 200


def test_openapi_json():
    response = client.get("/api/v1/openapi.json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
