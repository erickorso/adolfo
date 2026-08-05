from fastapi import APIRouter

from app import __version__
from app.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str | bool]:
    settings = get_settings()
    return {
        "ok": True,
        "service": "adolfo-mobile-api",
        "version": __version__,
        "adolfo_base_url": settings.adolfo_base_url,
        "ingest_secret_configured": bool(settings.adolfo_bearer_secret),
    }
