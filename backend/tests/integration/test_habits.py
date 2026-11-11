import secrets
from datetime import UTC, date, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import event
from sqlalchemy.orm import Session

from app import security
from app.database import get_engine
from app.models import Completion, Habit, User


def _user(db: Session, email: str, tz: str = "UTC") -> tuple[User, dict[str, str]]:
    u = User(email=email, password_hash=secrets.token_urlsafe(), timezone=tz)
    db.add(u)
    db.commit()
    token = security.create_session(db, u)
    return u, {"Authorization": f"Bearer {token}"}


def _habit(db: Session, u: User, name: str, days: list[date]) -> Habit:
    h = Habit(user_id=u.id, name=name)
    db.add(h)
    db.flush()
    db.add_all([Completion(habit_id=h.id, day=d) for d in days])
    db.commit()
    return h


def test_ac020_no_habits_empty_list(client: TestClient, db_session: Session) -> None:
    _, h = _user(db_session, "a@example.com")
    r = client.get("/habits", headers=h)
    assert r.status_code == 200
    assert r.json() == []


def test_ac019_lists_fields_and_isolates_users(client: TestClient, db_session: Session) -> None:
    a, ha = _user(db_session, "a@example.com")
    b, _ = _user(db_session, "b@example.com")
    today = security.now().date()
    _habit(db_session, a, "Read", [today, today - timedelta(days=1)])
    _habit(db_session, a, "Run", [])
    _habit(db_session, b, "Other", [today])
    body = client.get("/habits", headers=ha).json()
    assert sorted(x["name"] for x in body) == ["Read", "Run"]
    by = {x["name"]: x for x in body}
    assert set(by["Read"]) == {"id", "name", "done_today", "streak"}
    assert by["Read"]["done_today"] is True and by["Read"]["streak"] == 2
    assert by["Run"]["done_today"] is False and by["Run"]["streak"] == 0
    assert [x["id"] for x in body] == sorted(x["id"] for x in body)


def test_ac009_no_token_401(client: TestClient) -> None:
    r = client.get("/habits")
    assert r.status_code == 401
    assert isinstance(r.json()["detail"], str)


@pytest.mark.parametrize(
    ("tz", "done_today", "streak"),
    [("Pacific/Auckland", False, 1), ("America/Los_Angeles", True, 2)],
)
def test_ac021_today_follows_user_timezone(
    client: TestClient,
    db_session: Session,
    monkeypatch: pytest.MonkeyPatch,
    tz: str,
    done_today: bool,
    streak: int,
) -> None:
    # 2026-03-10 02:00 UTC: Auckland is already 03-10 15:00; Los Angeles is still 03-09.
    monkeypatch.setattr(security, "now", lambda: datetime(2026, 3, 10, 2, 0, tzinfo=UTC))
    u, h = _user(db_session, "tz@example.com", tz)
    # Auckland: today 03-10 not done, yesterday 03-09 done -> 1.
    # Los Angeles: today 03-09 done, 03-08 done -> 2.
    _habit(db_session, u, "H", [date(2026, 3, 9), date(2026, 3, 8)][: 2 if streak == 2 else 1])
    item = client.get("/habits", headers=h).json()[0]
    assert item["done_today"] is done_today
    assert item["streak"] == streak


def test_ac036_constant_query_count(client: TestClient, db_session: Session) -> None:
    u, h = _user(db_session, "q@example.com")
    today = security.now().date()

    def count() -> int:
        n = []
        engine = get_engine()

        def hook(*_a: object) -> None:
            n.append(1)

        event.listen(engine, "before_cursor_execute", hook)
        try:
            assert client.get("/habits", headers=h).status_code == 200
        finally:
            event.remove(engine, "before_cursor_execute", hook)
        return len(n)

    for i in range(3):
        _habit(db_session, u, f"h{i}", [today - timedelta(days=k) for k in range(3)])
    small = count()
    for i in range(3, 50):
        _habit(db_session, u, f"h{i}", [today - timedelta(days=k) for k in range(3)])
    assert len(client.get("/habits", headers=h).json()) == 50
    assert count() == small
