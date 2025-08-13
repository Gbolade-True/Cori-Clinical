from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from typing import List, Optional
import logging
from datetime import datetime

from app.models.schemas import City, Recommendation
from app.services.city_service import CityService
from app.services.recommendation_service import RecommendationService
from app.utils.validators import validate_and_sanitize_city_name
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Cori Clinical API",
    description="API for city search and AI recommendations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
city_service = CityService()
recommendation_service = RecommendationService()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/cities", response_model=List[City])
async def search_cities(
    name: str = Query(..., min_length=2, description="City search query"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results")
):
    """
    Search for cities by name
    """
    try:
        sanitized_search = validate_and_sanitize_city_name(name, "name")
        
        logger.info(f"Searching cities with query: '{sanitized_search}'")
        cities = await city_service.search_cities(sanitized_search, limit)
        return cities
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error searching cities: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to search cities")

@app.get("/ai_suggestions", response_model=List[Recommendation])
async def get_ai_recommendations(
    city: str = Query(..., description="City name for recommendations"),
    lat: float = Query(None, description="Latitude of the city"),
    lon: float = Query(None, description="Longitude of the city"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of recommendations")
):
    """
    Get AI-powered recommendations for a city
    """
    try:
        sanitized_city = validate_and_sanitize_city_name(city, "city")
        
        logger.info(f"Getting recommendations for city: '{sanitized_city}', category: '{category}'")
        recommendations = await recommendation_service.get_recommendations(
            sanitized_city, lat, lon, category, limit
        )
        return recommendations
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port)
