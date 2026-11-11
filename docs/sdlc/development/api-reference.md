# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /auth/me | me | `backend/app/routers/auth.py:85` | — |
| POST | /auth/signin | signin | `backend/app/routers/auth.py:61` | — |
| POST | /auth/signout | signout | `backend/app/routers/auth.py:74` | — |
| POST | /auth/signup | signup | `backend/app/routers/auth.py:47` | — |
| GET | /habits | list_habits | `backend/app/routers/habits.py:30` | — |
| GET | /health | health | `backend/app/main.py:60` | Liveness probe, and the only route here that is not a stub. |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /habits/{habit_id}
- POST /habits
- PUT /habits/{habit_id}/today
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `d43179e`
<!-- sdlc:auto:end source -->
