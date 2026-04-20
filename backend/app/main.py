from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router

from app.api.v1.routes.auth import login, register
from app.api.v1.routes.admin import venues as admin_venues, events as admin_events, monitoring as admin_monitoring
from app.api.v1.routes.user import events as user_events, bookings as user_bookings

app = FastAPI(
    title="CrowdFlow API",
    description="AI-powered sports venue crowd management backend.",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(api_router, prefix="/api/v1")
app.include_router(login.router, prefix="/api/v1/auth")
app.include_router(register.router, prefix="/api/v1/auth")
app.include_router(admin_venues.router, prefix="/api/v1/admin")
app.include_router(admin_events.router, prefix="/api/v1/admin")
app.include_router(admin_monitoring.router, prefix="/api/v1/admin")
app.include_router(user_events.router, prefix="/api/v1/user")
app.include_router(user_bookings.router, prefix="/api/v1/user")
