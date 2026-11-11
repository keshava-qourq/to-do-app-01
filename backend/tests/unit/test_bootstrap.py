import secrets

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.bootstrap import seed_bootstrap_admin
from app.config import Settings
from app.models import User


def _settings(email: str, password: str) -> Settings:
    return Settings(
        DATABASE_URL="postgresql+psycopg://unused",
        BOOTSTRAP_ADMIN_EMAIL=email,
        BOOTSTRAP_ADMIN_PASSWORD=password,
    )


def test_seeds_nothing_without_settings(db_session: Session) -> None:
    assert seed_bootstrap_admin(db_session, _settings("", "")) is False
    assert db_session.scalar(select(func.count()).select_from(User)) == 0


def test_seeds_once_and_is_idempotent(db_session: Session) -> None:
    settings = _settings("Admin@Example.com", secrets.token_urlsafe())
    assert seed_bootstrap_admin(db_session, settings) is True
    assert seed_bootstrap_admin(db_session, settings) is False
    user = db_session.scalars(select(User)).one()
    assert user.email == "admin@example.com"
    assert user.password_hash.startswith("$argon2id$")
