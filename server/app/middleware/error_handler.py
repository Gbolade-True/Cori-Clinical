from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging
from typing import Union

logger = logging.getLogger(__name__)

async def error_handler_middleware(request: Request, call_next):
    """
    Middleware to handle errors globally
    """
    try:
        response = await call_next(request)
        return response
    except HTTPException as e:
        logger.error(f"HTTP Exception: {e.detail}")
        return JSONResponse(
            status_code=e.status_code,
            content={"detail": e.detail, "error_code": "HTTP_ERROR"}
        )
    except Exception as e:
        logger.error(f"Unhandled Exception: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error_code": "INTERNAL_ERROR"}
        )
