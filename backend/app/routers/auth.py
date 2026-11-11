"""Sign-up, sign-in, sign-out and /auth/me."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import security
from app.database import get_db
from app.models import AuthSession, User

DB = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(security.get_current_user)]
CurrentSession = Annotated[tuple[User, AuthSession], Depends(security.get_current_session)]

router = APIRouter(prefix="/auth", tags=["auth"])


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)
    timezone: str | None = None

    @field_validator("email", mode="before")
    @classmethod
    def _normalize(cls, v: object) -> object:
        return v.strip().lower() if isinstance(v, str) else v


class UserOut(BaseModel):
    id: str
    email: str
    timezone: str


class AuthOut(BaseModel):
    token: str
    user: UserOut


def user_out(user: User) -> UserOut:
    return UserOut(id=str(user.id), email=user.email, timezone=user.timezone)


@router.post("/signup", status_code=201, response_model=AuthOut)
def signup(body: Credentials, db: DB) -> AuthOut:
    if db.scalar(select(User.id).where(User.email == body.email)) is not None:
        raise HTTPException(409, "An account already exists for this email")
    user = User(
        email=body.email,
        password_hash=security.hash_password(body.password),
        timezone=security.valid_timezone(body.timezone) or "UTC",
    )
    db.add(user)
    db.commit()
    return AuthOut(token=security.create_session(db, user), user=user_out(user))


@router.post("/signin", response_model=AuthOut)
def signin(body: Credentials, db: DB) -> AuthOut:
    user = db.scalar(select(User).where(User.email == body.email))
    ok = security.verify_password(user.password_hash if user else None, body.password)
    if user is None or not ok:
        raise HTTPException(401, "Invalid email or password")
    tz = security.valid_timezone(body.timezone)
    if tz and tz != user.timezone:
        user.timezone = tz
        db.commit()
    return AuthOut(token=security.create_session(db, user), user=user_out(user))


@router.post("/signout", status_code=204)
def signout(
    pair: CurrentSession,
    db: DB,
) -> Response:
    pair[1].revoked_at = security.now()
    db.add(pair[1])
    db.commit()
    return Response(status_code=204)


@router.get("/me", response_model=UserOut)
def me(user: CurrentUser) -> UserOut:
    return user_out(user)
