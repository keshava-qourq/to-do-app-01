"""Habit list for the signed-in user."""

from collections import defaultdict
from datetime import date
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import security
from app.database import get_db
from app.models import Completion, Habit, User
from app.services.streak import compute_streak

router = APIRouter(prefix="/habits", tags=["habits"])

__all__ = ["HabitOut", "compute_streak", "list_habits", "router"]


class HabitOut(BaseModel):
    id: str
    name: str
    done_today: bool
    streak: int


@router.get("", response_model=list[HabitOut])
def list_habits(
    user: Annotated[User, Depends(security.get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[HabitOut]:
    today = security.now().astimezone(ZoneInfo(user.timezone)).date()
    rows = db.execute(
        select(Habit.id, Habit.name, Completion.day)
        .outerjoin(Completion, Completion.habit_id == Habit.id)
        .where(Habit.user_id == user.id)
        .order_by(Habit.id)
    ).all()
    names: dict = {}
    days: dict[object, set[date]] = defaultdict(set)
    for hid, name, day in rows:
        names[hid] = name
        if day is not None:
            days[hid].add(day)
    return [
        HabitOut(
            id=str(hid),
            name=name,
            done_today=today in days[hid],
            streak=compute_streak(days[hid], today),
        )
        for hid, name in names.items()
    ]
