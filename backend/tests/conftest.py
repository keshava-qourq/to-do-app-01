"""Test fixtures: the real PostgreSQL that DATABASE_URL names, schema built by migrations.

The schema is applied once per run with Alembic (the only way the schema changes), and
every test's tables are emptied afterwards so tests never see each other's rows.
"""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.orm import Session

from app import models  # noqa: F401 -- imported so the tables register on Base.metadata
from app.database import Base, get_db, get_engine, get_sessionmaker
from app.main import app
from app.migrate import upgrade_to_head


@pytest.fixture(scope="session", autouse=True)
def _schema() -> None:
    upgrade_to_head()


@pytest.fixture
def db_session() -> Iterator[Session]:
    """A session on the test database; all rows are removed after the test."""
    session = get_sessionmaker()()
    try:
        yield session
    finally:
        session.close()
        tables = ", ".join(f'"{t.name}"' for t in Base.metadata.sorted_tables)
        with get_engine().begin() as conn:
            conn.execute(text(f"TRUNCATE {tables} RESTART IDENTITY CASCADE"))


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    """The application, talking to this test's database. Lifespan is not run."""

    def _get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
