import secrets
from datetime import date

from app import security
from app.routers.habits import compute_streak


def test_ac004_hash_and_verify() -> None:
    pw = secrets.token_urlsafe()
    h = security.hash_password(pw)
    assert h.startswith("$argon2") and pw not in h
    assert security.verify_password(h, pw)
    assert not security.verify_password(h, pw + "x")
    assert not security.verify_password(None, pw)


def test_token_hash_is_deterministic_hex() -> None:
    t = secrets.token_urlsafe()
    assert security.hash_token(t) == security.hash_token(t)
    assert len(security.hash_token(t)) == 64 and security.hash_token(t) != t


def test_valid_timezone() -> None:
    assert security.valid_timezone("Europe/Paris") == "Europe/Paris"
    assert security.valid_timezone("Nope/Zone") is None
    assert security.valid_timezone(None) is None


def test_streak_ends_today_or_yesterday() -> None:
    d = date
    assert compute_streak({d(2026, 1, 3), d(2026, 1, 2)}, d(2026, 1, 3)) == 2
    assert compute_streak({d(2026, 1, 2), d(2026, 1, 1)}, d(2026, 1, 3)) == 2
    assert compute_streak({d(2026, 1, 1)}, d(2026, 1, 3)) == 0
