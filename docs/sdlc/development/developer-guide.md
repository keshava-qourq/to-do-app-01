# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `d43179e` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
To Do app is a basic habit tracker in a single repository with two applications. `frontend/` is a Vite + React 19 single-page app written in TypeScript and styled with Tailwind CSS 4. It has Sign Up, Sign In and Today screens, with routing through react-router-dom. `backend/` is a FastAPI 0.115 service using SQLAlchemy 2, Alembic and psycopg 3 against PostgreSQL 16. It exposes `/health`, `/auth/signup`, `/auth/signin`, `/auth/signout`, `/auth/me` and `GET /habits`. The habits route returns each habit's `done_today` flag and current streak, computed in the user's timezone. On startup the backend validates its settings, applies Alembic migrations to head and seeds a bootstrap admin user. Auth uses an opaque bearer token: the frontend stores it in localStorage and `apiFetch` sends it on each call. In the extracted routes, the backend has no endpoints yet for adding habits, deleting habits or toggling today's completion. The README text saying the backend has only a health check is out of date. A GitHub Actions workflow deploys the API image to ECR and the frontend to AWS Amplify on every push to `main`.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Python 3.12 (the version in backend/Dockerfile)
- Node.js and npm (a release supported by Vite 6)
- Docker with Docker Compose, for the local PostgreSQL 16 database in docker-compose.yml
- Optional: Playwright Chromium for end-to-end tests (installed with `npm run test:e2e:install`)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. docker compose up -d db
2. cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt
3. Set DATABASE_URL for the backend so it points at the compose database (user/password/db `app`, port 5432), for example: export DATABASE_URL=postgresql+psycopg://app:app@localhost:5432/app. Check `.env.example` and `ENVIRONMENT.md` for any other settings `app/settings.py` requires.
4. cd backend && .venv/bin/python -m uvicorn app.main:app --reload
5. cd frontend && npm install
6. cd frontend && npm run dev
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| db | `docker compose up -d db` | Starts PostgreSQL 16 (user/password/database `app`) on port 5432, with data in the `db-data` volume. |
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI API on http://localhost:8000 with auto-reload. It applies migrations and seeds the bootstrap user on startup, and needs DATABASE_URL. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server (http://localhost:5173 by default). It calls VITE_API_BASE_URL, or http://localhost:8000 if that is unset. |
| build | `cd frontend && npm run build` | Bundles the SPA into frontend/dist. This does not typecheck. |
| preview | `cd frontend && npm run preview` | Serves the production build locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs `tsc --noEmit` over src/. |
| lint | `cd frontend && npm run lint` | Runs ESLint over the frontend. The platform uses this as a gate. Use `npm run lint:fix` to apply automatic fixes. |
| format | `cd frontend && npm run format` | Formats the frontend with Prettier. Use `npm run format:check` to check without writing. |
| backend lint | `cd backend && ruff check .` | Lints the backend with Ruff. |
| backend format | `cd backend && ruff format .` | Formats the backend with Ruff. |
| backend container | `docker build -t todo-api ./backend && docker run -p 8000:8000 -e DATABASE_URL="$DATABASE_URL" todo-api` | Builds and runs the API image from backend/Dockerfile. It runs uvicorn on port 8000 as a non-root user, with a /health healthcheck. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration (devcontainer.json). |
| `.github/workflows/` | deploy.yml: on every push to main, builds and pushes the backend image to ECR and builds and deploys the frontend to AWS Amplify, authenticating through OIDC. |
| `.quorq/` | Metadata from the Quorq platform (handoff.json, prepared.json). |
| `backend/` | FastAPI service: requirements.txt, Dockerfile, alembic.ini, pytest.ini and ruff.toml. |
| `backend/app/` | Application package: main.py (app, lifespan, CORS, routers), settings/config, database.py (engine and sessions), models.py, schemas.py, security.py (password hashing and sessions), bootstrap.py, migrate.py, routers/ (auth and habits) and services/ (streak calculation). |
| `backend/migrations/` | Alembic environment and versioned migrations (0001_initial.py). This is the only way the schema changes. |
| `backend/scripts/` | Utility scripts (check_connections.py). |
| `backend/tests/` | Pytest suites split into unit/, integration/ and acceptance/, with shared fixtures in conftest.py. |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, eslint and prettier config, playwright.config.ts. |
| `frontend/src/` | App source: main.tsx (router root), App.tsx (route table and auth guard), screens/ (SignUp, SignIn, Today with tests), lib/ (api client, auth, brand tokens, UI and icon components). |
| `frontend/e2e/` | Playwright acceptance specs and support helpers. |
| `frontend/coverage/` | Vitest v8 coverage output (json-summary). |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend routers use one module per area under app/routers, each an APIRouter with a prefix and tag (`/auth`, `/habits`). Each is registered in main.py.
- Dependencies are injected with `Annotated[..., Depends(...)]` aliases: `get_db` provides a per-request Session, and `security.get_current_user` / `get_current_session` handle auth.
- Request and response bodies are Pydantic v2 models, defined next to their router (e.g. Credentials, AuthOut, HabitOut). Emails are trimmed and lowercased.
- SQLAlchemy 2 typed models (`Mapped`/`mapped_column`) use UUID primary keys. Tables change only through Alembic migrations, which are applied automatically at startup.
- The engine and settings are built lazily (`lru_cache`), so importing the app never needs DATABASE_URL or opens a connection.
- Auth uses opaque bearer tokens, stored server-side as HMAC-SHA256 hashes in `auth_sessions`. The frontend keeps the token in localStorage under `session_token`.
- CORS origins come from ALLOWED_ORIGINS (comma-separated). The default is the Vite dev server on port 5173.
- Frontend imports use the `@/` alias for `src/`. Screens live in `src/screens/`, one per screen, and all API calls go through `apiFetch` in `src/lib/api.ts`.
- Styling uses Tailwind classes plus brand CSS variables (`--brand-*`) defined in `src/index.css` / `src/lib/brand.ts`.
- Component tests (`*.test.tsx`) sit beside the components they cover. Playwright specs live in `e2e/`.
- Frontend code style is enforced by ESLint and Prettier. Backend code style is enforced by Ruff.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the unit, integration and acceptance suites under backend/tests (pytest.ini sets pythonpath and testpaths). |
| frontend unit | `cd frontend && npm test` | Runs Vitest component tests in src/ under jsdom. |
| e2e install | `cd frontend && npm run test:e2e:install` | Installs the Playwright Chromium browser. |
| e2e | `cd frontend && npm run test:e2e` | Runs Playwright specs in e2e/. Without E2E_BASE_URL, it starts the backend from backend/.venv on port 8000 (DATABASE_URL required) and a preview build on port 4173. With E2E_BASE_URL set, it tests that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| The backend fails on startup with a settings error naming DATABASE_URL. | Start the database with `docker compose up -d db` and export DATABASE_URL pointing at it. Check `.env.example` / `ENVIRONMENT.md` for other required settings. |
| The browser reports CORS errors when calling the API. | Run the frontend on http://localhost:5173, or set ALLOWED_ORIGINS to your frontend origin (comma-separated) before starting the backend. |
| The frontend cannot reach the API. | Make sure the backend is running on http://localhost:8000, or set VITE_API_BASE_URL before running `npm run dev` or `npm run build`. The value is baked in at build time. |
| You are bounced to /sign-in unexpectedly. | Any 401 response clears the stored session token and redirects to sign-in. Sign in again, and check that the backend database still has your user and session. |
| `npm run build` succeeds but `npm run typecheck` fails. | The build does not typecheck. Fix the reported TypeScript errors, which are often untyped `useState({})` values. |
| Playwright cannot start the backend. | Create backend/.venv and install requirements into it (see setup), export DATABASE_URL, and run `npm run test:e2e:install` to fetch Chromium. |
| Habits cannot be created, deleted or marked done from the backend. | These endpoints don't exist yet; only `GET /habits` is implemented. They need to be added under app/routers/habits.py, along with any migrations. |
| An API secret key value is committed in plain text in .github/workflows/deploy.yml. | Treat it as exposed. Rotate it and move it to a GitHub Actions secret. |
<!-- sdlc:auto:end troubleshooting -->
