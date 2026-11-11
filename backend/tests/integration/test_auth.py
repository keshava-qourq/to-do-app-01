import secrets
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app import security
from app.models import AuthSession, User


@pytest.fixture
def pw() -> str:
    return secrets.token_urlsafe(12)


def _signup(client: TestClient, pw: str, email: str = "a@example.com", **extra):
    return client.post("/auth/signup", json={"email": email, "password": pw, **extra})


def _h(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_ac001_signup_returns_token(client: TestClient, pw: str) -> None:
    r = _signup(client, pw, " A@Example.com ", timezone="Europe/Paris")
    assert r.status_code == 201
    body = r.json()
    assert body["user"]["email"] == "a@example.com"
    assert body["user"]["timezone"] == "Europe/Paris"
    assert "set-cookie" not in r.headers
    assert client.get("/auth/me", headers=_h(body["token"])).json()["email"] == "a@example.com"


def test_ac002_duplicate_email_409(client: TestClient, db_session: Session, pw: str) -> None:
    assert _signup(client, pw).status_code == 201
    r = _signup(client, pw, "A@EXAMPLE.com")
    assert r.status_code == 409
    assert r.json() == {"detail": "An account already exists for this email"}
    assert len(db_session.scalars(select(User)).all()) == 1


@pytest.mark.parametrize(
    ("payload", "field"),
    [
        ({"email": "", "password": "x"}, "email"),
        ({"email": "nope", "password": "x"}, "email"),
        ({"email": "a@example.com", "password": ""}, "password"),
    ],
)
def test_ac003_validation_422(client: TestClient, payload: dict, field: str) -> None:
    r = client.post("/auth/signup", json=payload)
    assert r.status_code == 422
    assert any(e["loc"] == ["body", field] for e in r.json()["detail"])


def test_ac004_password_stored_hashed(client: TestClient, db_session: Session, pw: str) -> None:
    _signup(client, pw)
    row = db_session.execute(text("select * from users")).mappings().one()
    assert row["password_hash"].startswith("$argon2")
    assert pw not in [str(v) for v in row.values()]


def test_ac005_signin_ok_and_timezone_updates(client: TestClient, pw: str) -> None:
    _signup(client, pw)
    r = client.post(
        "/auth/signin",
        json={"email": "A@example.com", "password": pw, "timezone": "Asia/Tokyo"},
    )
    assert r.status_code == 200
    assert r.json()["user"]["timezone"] == "Asia/Tokyo"
    r = client.post(
        "/auth/signin", json={"email": "a@example.com", "password": pw, "timezone": "Bad/Zone"}
    )
    assert r.json()["user"]["timezone"] == "Asia/Tokyo"


def test_ac006_identical_401(client: TestClient, pw: str) -> None:
    _signup(client, pw)
    wrong = client.post("/auth/signin", json={"email": "a@example.com", "password": "zzz"})
    unknown = client.post("/auth/signin", json={"email": "b@example.com", "password": pw})
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json() == unknown.json() == {"detail": "Invalid email or password"}


def test_ac007_signout_revokes(client: TestClient, db_session: Session, pw: str) -> None:
    token = _signup(client, pw).json()["token"]
    assert client.post("/auth/signout", headers=_h(token)).status_code == 204
    assert client.get("/auth/me", headers=_h(token)).status_code == 401
    assert client.post("/auth/signout", headers=_h(token)).status_code == 401
    assert db_session.scalars(select(AuthSession)).one().revoked_at is not None


def test_ac008_expired_session_401(client: TestClient, db_session: Session, pw: str) -> None:
    token = _signup(client, pw).json()["token"]
    row = db_session.scalars(select(AuthSession)).one()
    row.expires_at = security.now() - timedelta(seconds=1)
    db_session.commit()
    assert client.get("/auth/me", headers=_h(token)).status_code == 401


@pytest.mark.parametrize("header", [None, "", "Bearer", "Basic abc", "Bearer unknown-token"])
def test_ac009_bad_token_401(client: TestClient, header: str | None) -> None:
    headers = {} if header is None else {"Authorization": header}
    for path in ("/auth/me", "/habits"):
        r = client.get(path, headers=headers)
        assert r.status_code == 401
        assert "detail" in r.json()


def test_ac009_habits_lists_own_only(client: TestClient, db_session: Session, pw: str) -> None:
    token = _signup(client, pw).json()["token"]
    other = _signup(client, pw, "o@example.com").json()["token"]
    me = db_session.scalars(select(User).where(User.email == "a@example.com")).one()
    from app.models import Habit

    db_session.add(Habit(user_id=me.id, name="Read"))
    db_session.commit()
    assert [h["name"] for h in client.get("/habits", headers=_h(token)).json()] == ["Read"]
    assert client.get("/habits", headers=_h(other)).json() == []


def test_token_stored_hashed(client: TestClient, db_session: Session, pw: str) -> None:
    token = _signup(client, pw).json()["token"]
    row = db_session.scalars(select(AuthSession)).one()
    assert row.token_hash != token
    assert row.token_hash == security.hash_token(token)
