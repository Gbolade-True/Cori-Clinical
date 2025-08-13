import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_search_cities_success():
    """Test city search with valid parameters"""
    response = client.get("/cities?name=London&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:  # If API key is configured and returns results
        city = data[0]
        assert "name" in city
        assert "country" in city
        assert "lat" in city
        assert "lon" in city

def test_ai_suggestions_success():
    """Test AI recommendations with valid parameters"""
    response = client.get("/ai_suggestions?city=London&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:  # If API key is configured and returns results
        recommendation = data[0]
        assert "category" in recommendation
        assert "name" in recommendation
        assert "description" in recommendation
