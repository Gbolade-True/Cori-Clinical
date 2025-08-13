import requests
from typing import List
import logging
from app.models.schemas import City, APINinjasCityResponse
from app.core.config import settings

logger = logging.getLogger(__name__)

class CityService:
    def __init__(self):
        self.base_url = "https://api.api-ninjas.com/v1/city"
        self.api_key = settings.api_ninjas_key
        
        if not self.api_key:
            logger.warning("API_NINJAS_KEY not found in environment variables")
        
    async def search_cities(self, search_query: str, limit: int = 10) -> List[City]:
        """
        Search for cities using API Ninjas City API
        """
        if not self.api_key:
            raise Exception("API Ninjas key not configured")
            
        try:
            params = {
                "name": search_query,
                # "limit": limit # API Ninjas free plan only allows limit of 1
            }
            headers = {
                "X-Api-Key": self.api_key
            }
            
            response = requests.get(
                self.base_url, 
                params=params, 
                headers=headers, 
                timeout=10.0
            )
            response.raise_for_status()
            
            data = response.json()
            cities = []
            
            for item in data:
                api_city = APINinjasCityResponse(**item)
                
                # Convert to the existing City model for client compatibility
                city = City(
                    name=api_city.name,
                    country=api_city.country,
                    state='',  # API Ninjas doesn't provide state
                    lat=api_city.latitude,
                    lon=api_city.longitude
                )
                cities.append(city)
            
            return cities
            
        except requests.HTTPError as e:
            logger.error(f"HTTP error occurred: {e}")
            raise Exception(f"Failed to fetch cities: {e}")
        except requests.RequestException as e:
            logger.error(f"Request error occurred: {e}")
            raise Exception("Failed to connect to city service")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise Exception("Failed to search cities")
