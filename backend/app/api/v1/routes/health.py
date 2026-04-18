from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Liveness probe — returns service status."""
    return {"status": "ok", "service": "crowdflow-backend"}
