# Cori Clinical Backend API

A FastAPI server that provides city search and AI recommendation services for the Cori Clinical frontend application.

## Features

-   **City Search**: Search for cities using API Ninjas City API
-   **AI Recommendations**: Get recommendations for places and activities in cities using Geoapify Places API
-   **Error Handling**: Comprehensive error handling and logging
-   **CORS Support**: Configured for frontend integration
-   **Rate Limiting**: Built-in rate limiting protection
-   **Validation**: Input validation and sanitization

## Setup

1. **Install dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

2. **Configure environment variables**:

    ```bash
    cp .env.example .env
    # Edit .env with your API keys
    ```

3. **Get API Keys**:

    - [API Ninjas City API](https://api-ninjas.com/api/city) - For city search
    - [Geoapify Places API](https://www.geoapify.com/places-api) - For recommendations

4. **Run the server**:
    ```bash
    python main.py
    # Or with uvicorn
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

## API Endpoints

### Health Check

-   `GET /health` - Server health status

### City Search

-   `GET /cities?name={query}&limit={limit}` - Search for cities
    -   `search`: City name (minimum 2 characters)
    -   `limit`: Maximum results (1-50, default: 10)

### AI Recommendations

-   `GET /ai_suggestions?city={city}&category={category}&limit={limit}` - Get recommendations
    -   `city`: City name (required)
    -   `category`: Filter by category (optional: food, sights, bars, shopping, entertainment)
    -   `limit`: Maximum results (1-50, default: 10)

## Data Models

### City

```json
{
	"name": "string",
	"country": "string",
	"state": "string (optional)",
	"lat": "number",
	"lon": "number"
}
```

### Recommendation

```json
{
  "category": "string",
  "name": "string",
  "description": "string",
  "rating": "number (optional)",
  "price": "string (optional)",
  "hours": "string (optional)",
  "location": "string (optional)",
  "tips": ["string"] (optional)
}
```

## Error Handling

The API returns appropriate HTTP status codes:

-   `200`: Success
-   `422`: Validation error
-   `500`: Internal server error

Error responses include:

```json
{
	"detail": "Error message",
	"error_code": "ERROR_TYPE"
}
```

## Development

### Running Tests

```bash
pytest tests/
```

### API Documentation

Once the server is running, visit:

-   Swagger UI: `http://localhost:8000/docs`
-   ReDoc: `http://localhost:8000/redoc`

## Production Deployment

2. Configure proper CORS origins
3. Set up API keys for production
4. Use a production ASGI server like Gunicorn with Uvicorn workers

## Security Considerations

-   API keys are stored in environment variables
-   Input validation and sanitization
-   CORS configuration
-   Error messages don't expose sensitive information
