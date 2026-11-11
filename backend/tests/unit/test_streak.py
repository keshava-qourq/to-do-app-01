from datetime import date, timedelta

from app.services.streak import compute_streak

T = date(2026, 3, 10)


def _run(n: int, end: date) -> set[date]:
    return {end - timedelta(days=i) for i in range(n)}


def test_ac019_streak_zero() -> None:
    assert compute_streak(set(), T) == 0


def test_ac019_streak_one_day() -> None:
    assert compute_streak({T}, T) == 1


def test_ac019_streak_many_days() -> None:
    assert compute_streak(_run(7, T), T) == 7


def test_ac019_streak_gap_resets() -> None:
    assert compute_streak({T - timedelta(days=2)}, T) == 0
    assert compute_streak(_run(3, T) | _run(2, T - timedelta(days=4)), T) == 3


def test_ac019_done_yesterday_not_today() -> None:
    assert compute_streak(_run(4, T - timedelta(days=1)), T) == 4
