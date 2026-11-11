"""Application entrypoint: settings validation, migrations, bootstrap user, CORS, routers."""

import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so the tables register on Base.metadata
from app.bootstrap import seed_bootstrap_admin
from app.config import get_settings
from app.database import get_sessionmaker
from app.migrate import upgrade_to_head


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Validate settings, apply migrations, seed the first user.

    Settings are validated first so a missing DATABASE_URL fails fast with an error that
    names it. This runs on startup and not at import, so importing the application never
    opens a connection and a test can point `get_db` at its own database.
    """
    settings = get_settings()
    upgrade_to_head()
    with get_sessionmaker()() as session:
        seed_bootstrap_admin(session, settings)
    yield


app = FastAPI(
    title="To Do app",
    description="A very basic habit tracker: habits, daily done/undo and streaks.",
    version="0.1.0",
    lifespan=lifespan,
)

# The SPA runs on a different origin than the API. ALLOWED_ORIGINS (comma separated) is
# the SPA's origin; without it the local Vite dev server is allowed. Auth is a bearer
# header, so cookies and credentials are not used.
# Read straight from the environment here (not via get_settings) so importing the app
# never requires DATABASE_URL.
_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins or ["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
