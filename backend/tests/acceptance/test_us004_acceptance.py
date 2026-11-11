"""US-004 acceptance: habit privacy and mutation invariants, through the real app."""

import secrets

import pytest
from sqlalchemy import text


@pytest.fixture
def pw() -> str:
    return secrets.token_urlsafe(12)


def _h(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _user(client, pw: str, email: str) -> dict[str, str]:
    r = client.post("/auth/signup", json={"email": email, "password": pw})
    assert r.status_code == 201
    return _h(r.json()["token"])


def _add(client, headers, name: str) -> str:
    r = client.post("/habits", json={"name": name}, headers=headers)
    assert r.status_code == 201
    return r.json()["id"]


def _count(db, sql: str, **p) -> int:
    return db.execute(text(sql), p).scalar()


def test_ac010_list_only_own_habits(client, pw) -> None:
    a, b = _user(client, pw, "a@example.com"), _user(client, pw, "b@example.com")
    ids_a = {_add(client, a, "A1"), _add(client, a, "A2")}
    ids_b = {_add(client, b, "B1")}
    got_a = client.get("/habits", headers=a).json()
    assert {x["id"] for x in got_a} == ids_a
    assert {x["id"] for x in client.get("/habits", headers=b).json()} == ids_b
    assert "B1" not in client.get("/habits", headers=a).text


def test_ac011_nfr005_cross_user_put_delete_404_unchanged(client, db_session, pw) -> None:
    a, b = _user(client, pw, "a@example.com"), _user(client, pw, "b@example.com")
    hb = _add(client, b, "B-habit")
    client.put(f"/habits/{hb}/today", json={"done": True}, headers=b)
    before = client.get("/habits", headers=b).json()
    assert client.put(f"/habits/{hb}/today", json={"done": False}, headers=a).status_code == 404
    assert client.put(f"/habits/{hb}/today", json={"done": True}, headers=a).status_code == 404
    assert client.delete(f"/habits/{hb}", headers=a).status_code == 404
    assert client.get("/habits", headers=b).json() == before
    assert before[0]["done_today"] is True
    assert client.get("/habits", headers=a).json() == []


def test_ac024_nfr010_repeated_put_one_completion(client, db_session, pw) -> None:
    a = _user(client, pw, "a@example.com")
    h = _add(client, a, "H")
    for _ in range(3):
        r = client.put(f"/habits/{h}/today", json={"done": True}, headers=a)
        assert r.status_code == 200
        assert r.json()["done_today"] is True and r.json()["streak"] == 1
    assert _count(db_session, "select count(*) from completions") == 1
    r = client.put(f"/habits/{h}/today", json={"done": False}, headers=a)
    assert r.json()["done_today"] is False and r.json()["streak"] == 0
    assert _count(db_session, "select count(*) from completions") == 0


def test_ac017_nfr006_delete_removes_habit_and_completions(client, db_session, pw) -> None:
    a = _user(client, pw, "a@example.com")
    keep = _add(client, a, "keep")
    h = _add(client, a, "gone")
    client.put(f"/habits/{h}/today", json={"done": True}, headers=a)
    client.put(f"/habits/{keep}/today", json={"done": True}, headers=a)
    assert client.delete(f"/habits/{h}", headers=a).status_code == 204
    assert [x["id"] for x in client.get("/habits", headers=a).json()] == [keep]
    assert _count(db_session, "select count(*) from habits where id = :i", i=h) == 0
    assert _count(db_session, "select count(*) from completions where habit_id = :i", i=h) == 0
    assert _count(db_session, "select count(*) from completions") == 1
    assert client.delete(f"/habits/{h}", headers=a).status_code == 404
