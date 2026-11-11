import secrets
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import security
from app.models import Completion, Habit, User


def _user(db: Session, email: str) -> tuple[User, dict[str, str]]:
    u = User(email=email, password_hash=secrets.token_urlsafe(), timezone="UTC")
    db.add(u)
    db.commit()
    return u, {"Authorization": f"Bearer {security.create_session(db, u)}"}


def _count(db: Session, model) -> int:
    return db.scalar(select(func.count()).select_from(model))


def test_ac012_create_returns_201_and_listed(client: TestClient, db_session: Session) -> None:
    _, h = _user(db_session, "a@example.com")
    r = client.post("/habits", json={"name": "  Read  "}, headers=h)
    assert r.status_code == 201
    body = r.json()
    assert (body["name"], body["done_today"], body["streak"]) == ("Read", False, 0)
    assert [x["id"] for x in client.get("/habits", headers=h).json()] == [body["id"]]


@pytest.mark.parametrize("name", ["", "   ", "x" * 101])
def test_ac013_ac014_invalid_name_422(client: TestClient, db_session: Session, name: str) -> None:
    _, h = _user(db_session, "a@example.com")
    r = client.post("/habits", json={"name": name}, headers=h)
    assert r.status_code == 422
    assert any(e["loc"] == ["body", "name"] and e["msg"] for e in r.json()["detail"])
    assert _count(db_session, Habit) == 0


def test_ac015_no_limit_and_100_chars_ok(client: TestClient, db_session: Session) -> None:
    _, h = _user(db_session, "a@example.com")
    for i in range(30):
        assert client.post("/habits", json={"name": f"h{i}"}, headers=h).status_code == 201
    assert client.post("/habits", json={"name": "x" * 100}, headers=h).status_code == 201


def test_ac022_ac023_ac024_toggle_idempotent(client: TestClient, db_session: Session) -> None:
    _, h = _user(db_session, "a@example.com")
    hid = client.post("/habits", json={"name": "Run"}, headers=h).json()["id"]
    for _ in range(3):
        r = client.put(f"/habits/{hid}/today", json={"done": True}, headers=h)
        assert r.status_code == 200
        assert (r.json()["done_today"], r.json()["streak"]) == (True, 1)
    assert _count(db_session, Completion) == 1
    assert client.get("/habits", headers=h).json()[0]["done_today"] is True
    r = client.put(f"/habits/{hid}/today", json={"done": False}, headers=h)
    assert r.json()["done_today"] is False
    assert _count(db_session, Completion) == 0
    assert client.put(f"/habits/{hid}/today", json={"done": False}, headers=h).status_code == 200


def test_ac016_ac017_delete_cascades(client: TestClient, db_session: Session) -> None:
    _, h = _user(db_session, "a@example.com")
    hid = client.post("/habits", json={"name": "Run"}, headers=h).json()["id"]
    client.put(f"/habits/{hid}/today", json={"done": True}, headers=h)
    r = client.delete(f"/habits/{hid}", headers=h)
    assert r.status_code == 204 and r.content == b""
    assert client.get("/habits", headers=h).json() == []
    assert _count(db_session, Habit) == 0
    assert _count(db_session, Completion) == 0


def test_ac025_no_date_endpoint(client: TestClient, db_session: Session) -> None:
    _, h = _user(db_session, "a@example.com")
    hid = client.post("/habits", json={"name": "Run"}, headers=h).json()["id"]
    r = client.put(f"/habits/{hid}/2020-01-01", json={"done": True}, headers=h)
    assert r.status_code in (404, 405)


def test_ac011_cross_user_and_missing_404(client: TestClient, db_session: Session) -> None:
    _, ha = _user(db_session, "a@example.com")
    _, hb = _user(db_session, "b@example.com")
    hid = client.post("/habits", json={"name": "Mine"}, headers=ha).json()["id"]
    client.put(f"/habits/{hid}/today", json={"done": True}, headers=ha)
    for other in (hid, str(uuid.uuid4()), "not-a-uuid"):
        r = client.put(f"/habits/{other}/today", json={"done": False}, headers=hb)
        assert r.status_code == 404
        assert client.delete(f"/habits/{other}", headers=hb).status_code == 404
    assert _count(db_session, Habit) == 1
    assert _count(db_session, Completion) == 1
    assert client.get("/habits", headers=hb).json() == []


def test_mutations_401_without_valid_token(client: TestClient, db_session: Session) -> None:
    u, h = _user(db_session, "a@example.com")
    hid = client.post("/habits", json={"name": "Mine"}, headers=h).json()["id"]
    client.post("/auth/signout", headers=h)
    for headers in ({}, h):
        assert client.post("/habits", json={"name": "x"}, headers=headers).status_code == 401
        assert (
            client.put(f"/habits/{hid}/today", json={"done": True}, headers=headers).status_code
            == 401
        )
        assert client.delete(f"/habits/{hid}", headers=headers).status_code == 401
    assert _count(db_session, Habit) == 1
    assert _count(db_session, Completion) == 0
