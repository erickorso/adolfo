from fastapi import APIRouter

from app import __version__

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str | bool]:
    return {"ok": True, "service": "adolfo-mobile-api", "version": __version__}
