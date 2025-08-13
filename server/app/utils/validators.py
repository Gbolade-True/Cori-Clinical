import re
from fastapi import HTTPException
from typing import Optional

def validate_city_name(city_name: str) -> bool:
    """
    Validate city name format
    """
    if not city_name or len(city_name.strip()) < 2:
        return False
    
    # Check for valid characters (letters, spaces, hyphens, apostrophes)
    pattern = r'^[a-zA-Z\s\-\']+$'
    return bool(re.match(pattern, city_name.strip()))

def sanitize_search_query(query: str) -> str:
    """
    Sanitize search query to prevent injection attacks
    """
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', query)
    return sanitized.strip()


def validate_and_sanitize_city_name(city_name: str, field_name: str = "city") -> str:
    """
    Validate and sanitize city name input
    
    Args:
        city_name: The city name to validate
        field_name: The field name for error messages (default: "city")
    
    Returns:
        Sanitized city name
        
    Raises:
        HTTPException: If validation fails
    """
    if not validate_city_name(city_name):
        raise HTTPException(
            status_code=422, 
            detail=f"Invalid {field_name} name format. Use only letters, spaces, hyphens, and apostrophes."
        )
    
    sanitized_name = sanitize_search_query(city_name)
    if not sanitized_name:
        raise HTTPException(
            status_code=422,
            detail=f"{field_name.capitalize()} name cannot be empty after sanitization."
        )
    
    return sanitized_name
