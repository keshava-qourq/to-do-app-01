"""Password hashing, opaque session tokens and the get_current_user dependency."""

import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta
from typing import Annotated
from zoneinfo import ZoneInfo

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from fastapi import Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AuthSession, User
from app.settings import get_settings

_hasher = PasswordHasher()
_DUMMY_HASH = _hasher.hash("not-a-real-password")


def now() -> datetime:
    """The clock; tests patch this."""
    return datetime.now(UTC)


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str | None, password: str) -> bool:
    try:
        return _hasher.verify(password_hash or _DUMMY_HASH, password) and password_hash is not None
    except (VerificationError, InvalidHashError):
        return False


def hash_token(token: str) -> str:
    key = get_settings().session_secret.encode()
    return hmac.new(key, token.encode(), hashlib.sha256).hexdigest()


def create_session(db: Session, user: User) -> str:
    token = secrets.token_urlsafe(32)
    db.add(
        AuthSession(
            user_id=user.id,
            token_hash=hash_token(token),
            expires_at=now() + timedelta(minutes=get_settings().session_lifetime_minutes),
        )
    )
    db.commit()
    return token


def valid_timezone(name: str | None) -> str | None:
    if not name:
        return None
    try:
        ZoneInfo(name)
    except Exception:
        return None
    return name


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=401, detail="Not authenticated", headers={"WWW-Authenticate": "Bearer"}
    )


def get_current_session(
    db: Annotated[Session, Depends(get_db)],
    authorization: Annotated[str | None, Header()] = None,
) -> tuple[User, AuthSession]:
    scheme, _, token = (authorization or "").partition(" ")
    token = token.strip()
    if scheme.lower() != "bearer" or not token:
        raise _unauthorized()
    row = db.scalar(select(AuthSession).where(AuthSession.token_hash == hash_token(token)))
    if row is None or row.revoked_at is not None or row.expires_at <= now():
        raise _unauthorized()
    user = db.get(User, row.user_id)
    if user is None:
        raise _unauthorized()
    return user, row


def get_current_user(
    pair: Annotated[tuple[User, AuthSession], Depends(get_current_session)],
) -> User:
    return pair[0]
