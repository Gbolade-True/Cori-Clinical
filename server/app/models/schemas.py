from pydantic import BaseModel, Field
from typing import List, Optional

class City(BaseModel):
    name: str = Field(..., description="City name")
    country: str = Field(..., description="Country name")
    state: Optional[str] = Field(None, description="State/province name")
    lat: float = Field(..., description="Latitude")
    lon: float = Field(..., description="Longitude")

class APINinjasCityResponse(BaseModel):
    name: str = Field(..., description="City name")
    latitude: float = Field(..., description="Latitude")
    longitude: float = Field(..., description="Longitude")
    country: str = Field(..., description="Country code")
    population: Optional[int] = Field(None, description="City population")
    is_capital: Optional[bool] = Field(None, description="Whether the city is the capital of the country")

class Recommendation(BaseModel):
    category: str = Field(..., description="Recommendation category")
    name: str = Field(..., description="Place/activity name")
    description: str = Field(..., description="Detailed description")
    rating: Optional[float] = Field(None, ge=0, le=5, description="Rating out of 5")
    price: Optional[str] = Field(None, description="Price range")
    hours: Optional[str] = Field(None, description="Operating hours")
    location: Optional[str] = Field(None, description="Location within city")
    tips: Optional[List[str]] = Field(None, description="Helpful tips")

class GeoapifyPlaceResponse(BaseModel):
    name: str = Field(..., description="Location name")
    country: Optional[str] = Field(None, description="Country component of an address")
    state: Optional[str] = Field(None, description="State component of an address")
    postcode: Optional[str] = Field(None, description="Postcode or ZIP code of an address")
    city: Optional[str] = Field(None, description="City component of an address")
    street: Optional[str] = Field(None, description="Street component of an address")
    lat: float = Field(..., description="Latitude coordinate of the location")
    lon: float = Field(..., description="Longitude coordinate of the location")
    formatted: Optional[str] = Field(None, description="Display address")
    address_line1: Optional[str] = Field(None, description="Main part of the display address, contains building street and house number or amenity name")
    address_line2: Optional[str] = Field(None, description="The second part of the display address, contains address parts not included to address_line1")
    categories: List[str] = Field(None, description="All categories that the places belongs to. Can take values of supported categories and supported conditions")
    place_id: str = Field(..., description="Unique identifier for the place, that can be used to extract additional information about the place with Place Details API")

class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")

