"""Habit list for the signed-in user."""

import uuid
from collections import defaultdict
from datetime import date
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, StringConstraints
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
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


class HabitCreate(BaseModel):
    name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class HabitTodayUpdate(BaseModel):
    done: bool


def _today(user: User) -> date:
    tz = ZoneInfo(security.valid_timezone(user.timezone) or "UTC")
    return security.now().astimezone(tz).date()


def _own_habit(db: Session, user: User, habit_id: str) -> Habit:
    try:
        hid = uuid.UUID(habit_id)
    except ValueError:
        raise HTTPException(404, "Habit not found") from None
    habit = db.scalar(select(Habit).where(Habit.id == hid, Habit.user_id == user.id))
    if habit is None:
        raise HTTPException(404, "Habit not found")
    return habit


def _habit_out(db: Session, habit: Habit, today: date) -> HabitOut:
    days = set(db.scalars(select(Completion.day).where(Completion.habit_id == habit.id)))
    return HabitOut(
        id=str(habit.id),
        name=habit.name,
        done_today=today in days,
        streak=compute_streak(days, today),
    )


@router.post("", status_code=201, response_model=HabitOut)
def create_habit(
    body: HabitCreate,
    user: Annotated[User, Depends(security.get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> HabitOut:
    habit = Habit(user_id=user.id, name=body.name)
    db.add(habit)
    db.commit()
    return HabitOut(id=str(habit.id), name=habit.name, done_today=False, streak=0)


@router.put("/{habit_id}/today", response_model=HabitOut)
def set_today(
    habit_id: str,
    body: HabitTodayUpdate,
    user: Annotated[User, Depends(security.get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> HabitOut:
    habit = _own_habit(db, user, habit_id)
    today = _today(user)
    if body.done:
        db.execute(
            insert(Completion)
            .values(habit_id=habit.id, day=today)
            .on_conflict_do_nothing(constraint="uq_completions_habit_day")
        )
    else:
        db.execute(
            delete(Completion).where(Completion.habit_id == habit.id, Completion.day == today)
        )
    db.commit()
    return _habit_out(db, habit, today)


@router.delete("/{habit_id}", status_code=204)
def delete_habit(
    habit_id: str,
    user: Annotated[User, Depends(security.get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    habit = _own_habit(db, user, habit_id)
    db.execute(delete(Habit).where(Habit.id == habit.id))
    db.commit()
    return Response(status_code=204)


@router.get("", response_model=list[HabitOut])
def list_habits(
    user: Annotated[User, Depends(security.get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[HabitOut]:
    today = _today(user)
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
