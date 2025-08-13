import requests
from typing import List, Optional
import logging
import random
from app.models.schemas import Recommendation, GeoapifyPlaceResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.base_url = "https://api.geoapify.com/v2/places"
        self.api_key = settings.geoapify_api_key
        self.categories = 'activity'
    
    async def get_recommendations(
        self, 
        city: str, 
        lat: float,
        lon: float,
        category: str,
        limit: int = 10
    ) -> List[Recommendation]:
        """
        Get recommendations using Geoapify Places API
        """
        try:
            recommendations = []
            
            real_recommendations = await self._get_geoapify_recommendations(
                city, lat, lon, category, limit
            )
            recommendations.extend(real_recommendations)
            
            # Shuffle and limit results
            random.shuffle(recommendations)
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
    
    async def _get_geoapify_recommendations(
        self, 
        city: str, 
        lat: float,
        lon: float,
        category: str,
        limit: int
    ) -> List[Recommendation]:
        """
        Get recommendations from Geoapify API
        """
        try:
            params = {
                "apiKey": self.api_key,
                "name": city,
                "limit": limit,
                "categories": category if category else self.categories,
                "bias": f"proximity:{lon},{lat}"
            }

            headers = {
                "Accept": "application/json"
            }
            
            response = requests.get(
                self.base_url,
                params=params,
                headers=headers,
                timeout=60.0
            )
            response.raise_for_status()
            
            data = response.json()
            recommendations = []
            
            for item in data.get("features", []):
                properties = item.get("properties", {})
                geoapify_place = GeoapifyPlaceResponse(**properties)
                
                recommendation = Recommendation(
                    category=geoapify_place.categories[0] or "general",
                    name=geoapify_place.name,
                    description=f"Located in {geoapify_place.city or geoapify_place.country or 'unknown location'}",
                    rating=random.randint(1, 5),  # Geoapify doesn't provide ratings
                    price=None,   # Geoapify doesn't provide price info
                    location=geoapify_place.formatted or geoapify_place.address_line1,
                    tips=self._generate_tips(geoapify_place.dict())
                )
                recommendations.append(recommendation)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error fetching from Geoapify: {e}")
            return []
    
    def _generate_tips(self, place: dict) -> List[str]:
        """
        Generate tips based on place data
        """
        tips = [
            f"Check opening hours before visiting {place.get('name', '')}",
            f"Consider making a reservation for {place.get('name', '')}",
            f"Read recent reviews for the best experience for {place.get('name', '')}"
        ]
        return tips
