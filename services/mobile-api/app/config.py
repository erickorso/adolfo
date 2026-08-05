from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from pydantic_settings import BaseSettings, SettingsConfigDict

_MOBILE_ROOT = Path(__file__).resolve().parents[1]
# Monorepo local: .../adolfo/services/mobile-api/app → parents[3] = adolfo.
# Docker/Render: /app/app/config.py → solo parents[0..2]; no hay monorepo root.
_cfg_path = Path(__file__).resolve()
_ADOLFO_ROOT = _cfg_path.parents[3] if len(_cfg_path.parents) > 3 else None

_ENV_FILES: tuple[Path, ...] = (
    _MOBILE_ROOT / ".env",
    _MOBILE_ROOT / ".env.local",
    *((_ADOLFO_ROOT / ".env", _ADOLFO_ROOT / ".env.local") if _ADOLFO_ROOT else ()),
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILES,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    mobile_jwt_secret: str = "dev-only-change-me"
    mobile_jwt_expire_minutes: int = 60 * 24 * 7
    mobile_api_port: int = 4002
    mobile_cors_origins: str = (
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8081"
    )
    mobile_jwt_algorithm: str = "HS256"
    # Proxy ingest / AI → Next.js Adolfo
    adolfo_base_url: str = "http://127.0.0.1:3000"
    jobs_ingest_secret: str | None = None
    ai_generate_secret: str | None = None

    @property
    def adolfo_bearer_secret(self) -> str:
        """Bearer para ingest y /api/ai/generate."""
        return (self.ai_generate_secret or self.jobs_ingest_secret or "").strip()

    @property
    def async_database_url(self) -> str:
        url = self.database_url.strip()
        if url.startswith("prisma+postgres://"):
            url = "postgresql://" + url.removeprefix("prisma+postgres://")
        if url.startswith("postgres://"):
            url = "postgresql://" + url.removeprefix("postgres://")
        if url.startswith("postgresql://") and "+asyncpg" not in url:
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

        # asyncpg no usa sslmode=; lo normalizamos a connect_args vía flag.
        parsed = urlparse(url)
        qs = parse_qs(parsed.query)
        qs.pop("sslmode", None)
        qs.pop("channel_binding", None)
        clean = parsed._replace(query=urlencode({k: v[0] for k, v in qs.items()}))
        return urlunparse(clean)

    @property
    def db_connect_args(self) -> dict:
        raw = self.database_url.lower()
        if "sslmode=require" in raw or "neon.tech" in raw:
            return {"ssl": True}
        return {}

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.mobile_cors_origins.split(",") if o.strip()]


def get_settings() -> Settings:
    # Sin cache: permite recargar JOBS_INGEST_SECRET / ADOLFO_BASE_URL al editar .env
    # (lru_cache dejaba el BFF con secret vacío tras el primer boot).
    return Settings()  # type: ignore[call-arg]
