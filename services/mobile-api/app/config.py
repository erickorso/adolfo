from functools import lru_cache
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from pydantic_settings import BaseSettings, SettingsConfigDict

_MOBILE_ROOT = Path(__file__).resolve().parents[1]
_ADOLFO_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(
            _MOBILE_ROOT / ".env",
            _MOBILE_ROOT / ".env.local",
            _ADOLFO_ROOT / ".env",
            _ADOLFO_ROOT / ".env.local",
        ),
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


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
