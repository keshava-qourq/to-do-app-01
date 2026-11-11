"""Seed the first user from BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD.

Runs on startup. Idempotent: creates the user only when no user with that email exists.
With either setting empty (local runs, tests) it seeds nothing. The app has no roles,
so this is an ordinary user.
"""

from argon2 import PasswordHasher
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import Settings
from app.models import User

_hasher = PasswordHasher()


def seed_bootstrap_admin(session: Session, settings: Settings) -> bool:
    """Returns True when a user was created."""
    email = settings.bootstrap_admin_email.strip().lower()
    password = settings.bootstrap_admin_password
    if not email or not password:
        return False
    if session.scalar(select(User.id).where(User.email == email)) is not None:
        return False
    session.add(User(email=email, password_hash=_hasher.hash(password), timezone="UTC"))
    session.commit()
    return True
