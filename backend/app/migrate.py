"""Apply Alembic migrations to the configured database (used at startup)."""

from pathlib import Path

from alembic import command
from alembic.config import Config

_BACKEND = Path(__file__).resolve().parent.parent


def upgrade_to_head() -> None:
    command.upgrade(Config(str(_BACKEND / "alembic.ini")), "head")
