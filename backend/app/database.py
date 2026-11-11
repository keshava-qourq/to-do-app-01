"""Engine, session factory and the request-scoped session dependency.

PostgreSQL only: `DATABASE_URL` is a required setting. The engine is built on first
use, not at import, so importing the application never opens a connection or needs
the environment. The schema changes only through Alembic migrations (backend/migrations).
"""

from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings


@lru_cache
def get_engine() -> Engine:
    return create_engine(get_settings().database_url, pool_pre_ping=True, future=True)


@lru_cache
def get_sessionmaker() -> sessionmaker[Session]:
    return sessionmaker(bind=get_engine(), autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Declarative base that every model inherits."""


def get_db() -> Iterator[Session]:
    """One session per request, closed even when the handler raises."""
    session = get_sessionmaker()()
    try:
        yield session
    finally:
        session.close()
