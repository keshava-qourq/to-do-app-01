import secrets
from datetime import date

from fastapi.testclient import TestClient
from sqlalchemy import inspect, select, text
from sqlalchemy.orm import Session

from app.database import get_engine, get_sessionmaker
from app.main import app
from app.migrate import upgrade_to_head
from app.models import Completion, Habit, User


def test_ac035_rows_survive_restart(db_session: Session) -> None:
    user = User(email="a@example.com", password_hash=secrets.token_urlsafe())
    db_session.add(user)
    db_session.flush()
    habit = Habit(user_id=user.id, name="Read")
    db_session.add(habit)
    db_session.flush()
    db_session.add_all([Completion(habit_id=habit.id, day=date(2026, 1, d)) for d in (1, 2)])
    db_session.commit()
    get_engine().dispose()
    with TestClient(app):  # runs lifespan: migrations + seed
        pass
    with get_sessionmaker()() as s:
        assert s.scalar(select(User.timezone)) == "UTC"
        assert s.scalar(select(Habit.name)) == "Read"
        assert len(s.scalars(select(Completion)).all()) == 2


def test_ac036_indexes_exist_and_upgrade_is_idempotent() -> None:
    upgrade_to_head()
    upgrade_to_head()
    insp = inspect(get_engine())
    assert any(i["column_names"] == ["user_id"] for i in insp.get_indexes("habits"))
    uniques = [u["column_names"] for u in insp.get_unique_constraints("completions")]
    assert ["habit_id", "day"] in uniques
    cols = {c["name"] for c in insp.get_columns("auth_sessions")}
    assert "revoked_at" in cols
    with get_engine().connect() as c:
        assert c.execute(text("select count(*) from alembic_version")).scalar() == 1


def test_cors_preflight_allows_authorization(client: TestClient) -> None:
    r = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization",
        },
    )
    assert r.status_code == 200
    assert "authorization" in r.headers["access-control-allow-headers"].lower()
    assert "access-control-allow-credentials" not in r.headers
