"""Streak calculation."""

from datetime import date, timedelta


def compute_streak(days: set[date], today: date) -> int:
    """Consecutive completion days ending today, or yesterday when not done today."""
    cursor = today if today in days else today - timedelta(days=1)
    count = 0
    while cursor in days:
        count += 1
        cursor -= timedelta(days=1)
    return count
