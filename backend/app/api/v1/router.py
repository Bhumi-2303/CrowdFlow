from fastapi import APIRouter

from app.api.v1.routes import health, status, venues, zones

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(status.router)
api_router.include_router(venues.router)
api_router.include_router(zones.router)
