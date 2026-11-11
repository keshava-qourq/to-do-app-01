"""Application settings, read from the environment.

`get_settings()` is called at startup (and lazily by the database layer), never at
import, so importing the application opens nothing and needs no environment.
A missing required setting fails fast with an error that names it.
"""

import secrets
from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore", populate_by_name=True)

    # Required. The error for a missing one names the variable.
    database_url: str = Field(validation_alias="DATABASE_URL")

    # Private key that session tokens are HMAC-hashed with. SESSION_SECRET is the name
    # the architecture uses; the platform also provides JWT_SECRET_KEY, accepted as
    # the same thing. Locally, with neither set, a random per-process value is used
    # (sessions then do not survive a restart, which is fine for a local run).
    # Never use SECRET_KEY here: it is the public API bearer.
    session_secret: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        validation_alias=AliasChoices("SESSION_SECRET", "JWT_SECRET_KEY"),
    )

    # Comma separated origins of the SPA. Empty means the local Vite dev server.
    allowed_origins: str = Field(default="", validation_alias="ALLOWED_ORIGINS")

    # Minutes an auth session stays valid.
    session_lifetime_minutes: int = Field(default=1440, validation_alias="SESSION_LIFETIME_MINUTES")

    # First admin, set by the platform on the deployed API only.
    bootstrap_admin_email: str = Field(default="", validation_alias="BOOTSTRAP_ADMIN_EMAIL")
    bootstrap_admin_password: str = Field(default="", validation_alias="BOOTSTRAP_ADMIN_PASSWORD")

    @property
    def cors_origins(self) -> list[str]:
        origins = [o.strip() for o in self.allowed_origins.split(",") if o.strip()]
        return origins or _DEV_ORIGINS


@lru_cache
def get_settings() -> Settings:
    return Settings()
