import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

def test_search_cities():
    response = client.get("/cities?name=London&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:  # If API key is configured
        assert "name" in data[0]
        assert "country" in data[0]
        assert "lat" in data[0]
        assert "lon" in data[0]

def test_get_recommendations():
    response = client.get("/ai_suggestions?city=London&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "category" in data[0]
        assert "name" in data[0]
        assert "description" in data[0]

def test_invalid_city_search():
    response = client.get("/cities?name=a&limit=5")
    assert response.status_code == 422  # Validation error

def test_missing_city_parameter():
    response = client.get("/ai_suggestions")
    assert response.status_code == 422  # Validation error

