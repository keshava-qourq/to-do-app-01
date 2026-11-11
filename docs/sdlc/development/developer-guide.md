# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `dc97220` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
A habit tracker ("To Do app") in one repository with two apps. The backend is a FastAPI service using SQLAlchemy 2, Alembic migrations and PostgreSQL. It provides email/password auth with opaque bearer-token sessions, plus a habit list endpoint that returns each habit's done-today flag and streak. The frontend is a Vite + React 19 + TypeScript SPA styled with Tailwind, with sign-up, sign-in and Today screens. api.ts provides the API client, which sends the session token as a bearer header. The README says some screens still render seeded sample data, but the Today screen's wiring isn't visible in the provided files. Only habit listing is implemented server-side; creating or deleting habits and marking them done are not among the extracted routes. Deployment is a GitHub Actions workflow that pushes the backend Docker image and publishes the frontend build.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js and npm (version not pinned in the manifests; the stack is React 19 / Vite 6)
- Python 3.12 (the backend Dockerfile uses python:3.12-slim)
- PostgreSQL 16, or Docker with Docker Compose to run the provided db service
- Docker (only to build or run the backend image)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Start PostgreSQL: docker compose up -d db
2. Create a backend virtualenv (Playwright expects backend/.venv): cd backend && python -m venv .venv && source .venv/bin/activate
3. Install backend dependencies: pip install -r requirements.txt
4. Set DATABASE_URL (required; see .env.example). For the compose database, the credentials app/app and database app give a value like: export DATABASE_URL=postgresql+psycopg://app:app@localhost:5432/app
5. Optionally set ALLOWED_ORIGINS (comma separated) to the SPA origin; by default http://localhost:5173 and http://127.0.0.1:5173 are allowed
6. Install frontend dependencies: cd frontend && npm install
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| db | `docker compose up -d db` | Starts the local PostgreSQL 16 container (user, password and database all 'app', port 5432). |
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the API with auto-reload on port 8000. On startup it validates settings, applies Alembic migrations and seeds the bootstrap user. |
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the SPA. |
| frontend build | `cd frontend && npm run build` | Bundles the SPA with Vite. This does not typecheck. |
| frontend preview | `cd frontend && npm run preview` | Serves the built bundle locally. |
| typecheck | `cd frontend && npm run typecheck` | Runs tsc --noEmit on the frontend. |
| lint | `cd frontend && npm run lint` | Runs ESLint over the frontend; use npm run lint:fix to apply automatic fixes. |
| format | `cd frontend && npm run format` | Formats the frontend with Prettier; npm run format:check only checks. |
| backend lint/format | `cd backend && ruff check . && ruff format .` | Lints and formats the backend with Ruff. |
| backend image | `docker build -t todo-backend ./backend` | Builds the backend container image, which runs uvicorn on port 8000 as an unprivileged user with a /health healthcheck. The tag todo-backend is arbitrary. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer/` | Dev container configuration. |
| `.github/workflows/` | CI: deploy.yml (backend image to ECR, frontend to Amplify) and sonar-scan.yml (manual SonarQube scan). |
| `.quorq/` | Platform metadata files (handoff.json, prepared.json). |
| `backend/` | FastAPI service: Dockerfile, requirements.txt, alembic.ini, pytest.ini, ruff.toml. |
| `backend/app/` | Application code: main.py (app, lifespan, CORS), settings.py/config.py, database.py, models.py, schemas.py, security.py, bootstrap.py, migrate.py. |
| `backend/app/routers/` | API routers: auth.py (/auth/*) and habits.py (/habits). |
| `backend/app/services/` | Domain logic, e.g. streak.py (compute_streak). |
| `backend/migrations/` | Alembic environment and versioned migrations (versions/0001_initial.py). The schema changes only through migrations. |
| `backend/scripts/` | Helper scripts, e.g. check_connections.py. |
| `backend/tests/` | pytest suites: unit/, integration/, acceptance/, plus conftest.py. |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, playwright.config.ts, eslint.config.js. |
| `frontend/src/` | App.tsx (shell and route table), main.tsx (entry), index.css, and Vitest tests beside the components. |
| `frontend/src/lib/` | api.ts (fetch client and session token helpers), auth.ts, brand.ts, icons.tsx, navigate.ts, ui.tsx. |
| `frontend/src/screens/` | One module per screen: SignIn, SignUp, Today, with their tests. |
| `frontend/e2e/` | Playwright acceptance tests and support helpers. |
| `frontend/coverage/` | Generated Vitest coverage summary. |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Backend settings and the DB engine are built lazily (get_settings, get_engine with lru_cache), so importing the app never needs DATABASE_URL or opens a connection.
- Schema changes go through Alembic migrations only; a model change needs an accompanying migration. Tables are not auto-created.
- Routers are one module per feature under backend/app/routers, each with its own prefix and tag, included in main.py. Routes use Annotated dependencies (Depends(get_db), security.get_current_user).
- Auth uses opaque bearer tokens stored as HMAC hashes in auth_sessions, not cookies. Emails are stored lowercase, and each user's day calculations use the user's timezone.
- Frontend uses the '@' alias for src/, function components, react-router-dom routes with a RequireAuth wrapper, and Tailwind with brand CSS variables (--brand-*).
- All frontend HTTP calls go through apiFetch in src/lib/api.ts. A 401 clears the token and triggers a redirect to /sign-in.
- Frontend component tests sit beside the code as *.test.tsx; Playwright specs live in frontend/e2e and are excluded from Vitest.
- Backend tests are split into unit, integration and acceptance directories. Code style is enforced with Ruff on the backend and ESLint plus Prettier on the frontend.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the unit, integration and acceptance tests under backend/tests (pytest.ini sets pythonpath to backend/). pytest-cov is installed. Integration tests probably need a reachable PostgreSQL, but conftest.py was not provided. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests (src/**/*.test.tsx) in jsdom. |
| e2e install | `cd frontend && npm run test:e2e:install` | Installs the Playwright Chromium browser. |
| e2e | `cd frontend && npm run test:e2e` | Runs the Playwright tests. Without E2E_BASE_URL it starts the backend from backend/.venv (which needs DATABASE_URL) and builds and previews the frontend on port 4173. With E2E_BASE_URL set it runs against that deployed URL. |
| backend lint | `cd backend && ruff check .` | Static checks for the backend. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| The backend fails at startup with an error naming DATABASE_URL. | DATABASE_URL is required, and settings are validated at startup. Export a PostgreSQL URL (see .env.example) and make sure the database is running, e.g. docker compose up -d db. |
| The browser reports CORS errors when the SPA calls the API. | By default only http://localhost:5173 and http://127.0.0.1:5173 are allowed. Set ALLOWED_ORIGINS to the SPA's origin (comma separated) and restart the backend. |
| The frontend calls the wrong API host. | The base URL comes from VITE_API_BASE_URL at build time and falls back to http://localhost:8000. Set it before running npm run dev or npm run build. |
| npm run build succeeds but tsc reports type errors. | The build does not typecheck. Run npm run typecheck and fix the reported errors. |
| Playwright e2e fails to start the backend. | The config runs backend/.venv/bin/python, so create the venv and install requirements first. Also export DATABASE_URL, or set E2E_BASE_URL to test an already-running deployment. |
| Playwright cannot launch Chromium. | Run npm run test:e2e:install in frontend/ to download the browser. |
| The app keeps redirecting to /sign-in. | RequireAuth redirects when no session token is stored, and any 401 response clears the token. Sign in again via /sign-in and check that the backend is reachable. |
<!-- sdlc:auto:end troubleshooting -->
