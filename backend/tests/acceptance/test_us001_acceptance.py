"""US-001 acceptance: auth and Today data, through the real app."""

import secrets
from datetime import UTC, date, datetime, timedelta

import pytest
from argon2 import PasswordHasher
from fastapi.testclient import TestClient
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app import security
from app.bootstrap import seed_bootstrap_admin
from app.config import Settings
from app.models import AuthSession, Completion, Habit, User


@pytest.fixture
def pw() -> str:
    return secrets.token_urlsafe(12)


def _signup(client: TestClient, pw: str, email: str = "a@example.com", tz: str | None = None):
    body = {"email": email, "password": pw}
    if tz:
        body["timezone"] = tz
    return client.post("/auth/signup", json=body)


def _h(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _user_id(db: Session, email: str):
    return db.scalars(select(User).where(User.email == email)).one().id


def _seed(db: Session, user_id, name: str, days: list[date]) -> Habit:
    h = Habit(user_id=user_id, name=name)
    db.add(h)
    db.flush()
    db.add_all([Completion(habit_id=h.id, day=d) for d in days])
    db.commit()
    return h


def test_ac002_duplicate_signup_409_one_row(client, db_session, pw) -> None:
    assert _signup(client, pw).status_code == 201
    for email in ("a@example.com", "A@Example.COM"):
        assert _signup(client, pw, email).status_code == 409
    rows = db_session.execute(text("select count(*) from users where lower(email)='a@example.com'"))
    assert rows.scalar() == 1


@pytest.mark.parametrize(
    ("email", "password", "field"),
    [("", "x", "email"), ("not-an-email", "x", "email"), ("a@example.com", "", "password")],
)
def test_ac003_nfr013_invalid_signup_names_field(client, email, password, field) -> None:
    r = client.post("/auth/signup", json={"email": email, "password": password})
    assert r.status_code == 422
    assert field in [e["loc"][-1] for e in r.json()["detail"]]


def test_ac004_nfr001_password_hashed_everywhere(client, db_session, pw) -> None:
    _signup(client, pw)
    row = db_session.execute(text("select * from users")).mappings().one()
    assert row["password_hash"] != pw
    assert PasswordHasher().verify(row["password_hash"], pw)
    assert all(pw not in str(v) for v in row.values())
    sess = db_session.execute(text("select * from auth_sessions")).mappings().all()
    assert all(pw not in str(v) for r in sess for v in r.values())


def test_ac006_nfr004_401_bodies_byte_identical(client, pw) -> None:
    _signup(client, pw)
    wrong = client.post("/auth/signin", json={"email": "a@example.com", "password": pw + "x"})
    unknown = client.post("/auth/signin", json={"email": "zz@example.com", "password": pw})
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.content == unknown.content


def test_ac007_nfr002_signout_revokes_token(client, pw) -> None:
    token = _signup(client, pw).json()["token"]
    assert client.get("/habits", headers=_h(token)).status_code == 200
    assert client.post("/auth/signout", headers=_h(token)).status_code == 204
    assert client.get("/auth/me", headers=_h(token)).status_code == 401
    assert client.get("/habits", headers=_h(token)).status_code == 401


def test_ac008_expired_session_401(client, db_session, pw) -> None:
    token = _signup(client, pw).json()["token"]
    row = db_session.scalars(select(AuthSession)).one()
    row.expires_at = security.now() - timedelta(minutes=5)
    db_session.commit()
    assert client.get("/auth/me", headers=_h(token)).status_code == 401
    assert client.get("/habits", headers=_h(token)).status_code == 401


def test_ac009_nfr003_no_garbage_or_revoked_token(client, db_session, pw) -> None:
    token = _signup(client, pw).json()["token"]
    _seed(db_session, _user_id(db_session, "a@example.com"), "Secret habit", [])
    client.post("/auth/signout", headers=_h(token))
    cases = [{}, _h(secrets.token_urlsafe(32)), _h(token)]
    for headers in cases:
        for path in ("/auth/me", "/habits"):
            r = client.get(path, headers=headers)
            assert r.status_code == 401
            assert "Secret habit" not in r.text
            assert isinstance(r.json(), dict)


def test_nfr005_users_never_see_each_others_habits(client, db_session, pw) -> None:
    ta = _signup(client, pw, "a@example.com").json()["token"]
    tb = _signup(client, pw, "b@example.com").json()["token"]
    today = security.now().date()
    ha = _seed(db_session, _user_id(db_session, "a@example.com"), "A-habit", [])
    hb = _seed(db_session, _user_id(db_session, "b@example.com"), "B-habit", [today])
    a = client.get("/habits", headers=_h(ta))
    b = client.get("/habits", headers=_h(tb))
    assert [x["id"] for x in a.json()] == [str(ha.id)]
    assert [x["id"] for x in b.json()] == [str(hb.id)]
    assert str(hb.id) not in a.text and "B-habit" not in a.text
    assert a.json()[0]["done_today"] is False and a.json()[0]["streak"] == 0
    assert str(ha.id) not in b.text


def test_ac019_ac020_list_values_and_empty(client, db_session, pw) -> None:
    token = _signup(client, pw).json()["token"]
    assert client.get("/habits", headers=_h(token)).json() == []
    uid = _user_id(db_session, "a@example.com")
    today = security.now().date()
    d = timedelta(days=1)
    _seed(db_session, uid, "three", [today, today - d, today - 2 * d])
    _seed(db_session, uid, "yesterday", [today - d, today - 2 * d])
    _seed(db_session, uid, "gap", [today, today - 3 * d])
    _seed(db_session, uid, "none", [])
    by = {x["name"]: x for x in client.get("/habits", headers=_h(token)).json()}
    assert (by["three"]["done_today"], by["three"]["streak"]) == (True, 3)
    assert (by["yesterday"]["done_today"], by["yesterday"]["streak"]) == (False, 2)
    assert (by["gap"]["done_today"], by["gap"]["streak"]) == (True, 1)
    assert (by["none"]["done_today"], by["none"]["streak"]) == (False, 0)


@pytest.mark.parametrize(
    ("tz", "done_today", "streak"),
    [("Pacific/Auckland", True, 1), ("America/Los_Angeles", False, 0)],
)
def test_ac021_nfr012_own_day_across_utc_boundary(
    client, db_session, monkeypatch, pw, tz, done_today, streak
) -> None:
    # 2026-03-10 02:00 UTC: Auckland is on 03-10, Los Angeles still on 03-09.
    monkeypatch.setattr(security, "now", lambda: datetime(2026, 3, 10, 2, 0, tzinfo=UTC))
    token = _signup(client, pw, tz=tz).json()["token"]
    _seed(db_session, _user_id(db_session, "a@example.com"), "H", [date(2026, 3, 10)])
    item = client.get("/habits", headers=_h(token)).json()[0]
    assert item["done_today"] is done_today
    assert item["streak"] == streak


def _settings(email: str, password: str) -> Settings:
    return Settings(
        DATABASE_URL="postgresql+psycopg://unused",
        BOOTSTRAP_ADMIN_EMAIL=email,
        BOOTSTRAP_ADMIN_PASSWORD=password,
    )


def test_first_user_seeded_can_sign_in(client, db_session) -> None:
    email, password = "first@example.com", secrets.token_urlsafe(12)
    assert seed_bootstrap_admin(db_session, _settings(email, password)) is True
    r = client.post("/auth/signin", json={"email": email, "password": password})
    assert r.status_code == 200
    assert client.get("/auth/me", headers=_h(r.json()["token"])).json()["email"] == email


def test_first_user_absent_when_settings_unset(db_session) -> None:
    assert seed_bootstrap_admin(db_session, _settings("", "")) is False
    assert db_session.execute(text("select count(*) from users")).scalar() == 0
