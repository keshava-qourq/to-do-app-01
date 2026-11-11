# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | Sign up with email and password | US-001 | 1 | GET /auth/me, POST /auth/signup, api, sessions, users, web_spa | backend/app/config.py, backend/app/database.py, backend/app/main.py, backend/app/models.py, backend/app/routers/auth.py +22 more | b55e4e6 | delivered | succeeded | 4/4 tested · 0/4 passing | d43179e8fd4b |
| US-002 | EPIC-001 | Sign in and sign out | US-002 | 1 | GET /auth/me, POST /auth/signin, POST /auth/signout, api, sessions, users, web_spa | — | b55e4e6 | delivered | not run | 5/5 tested · 0/5 passing | d43179e8fd4b |
| US-003 | EPIC-001 | Each user sees only their own habits | US-003 | 2 | DELETE /habits/{habit_id}, GET /habits, PUT /habits/{habit_id}/today, api, completions, habits, users | — | 35cdd43 | delivered | not run | 2/2 tested · 0/2 passing | — |
| US-004 | EPIC-002 | Add a habit | US-004 | 2 | POST /habits, api, habits, web_spa | backend/tests/acceptance/test_us004_acceptance.py, frontend/e2e/today.spec.ts, frontend/src/App.tsx, frontend/src/screens/Today.test.tsx, frontend/src/screens/Today.tsx | 35cdd43 | delivered | succeeded | 4/4 tested · 0/4 passing | — |
| US-005 | EPIC-002 | Delete a habit | US-005 | 2 | DELETE /habits/{habit_id}, api, completions, habits, web_spa | — | 35cdd43 | delivered | not run | 3/3 tested · 0/3 passing | — |
| US-006 | EPIC-003 | See my habits on the Today screen | US-006 | 1 | GET /habits, api, completions, habits, users, web_spa | — | b55e4e6 | delivered | not run | 3/3 tested · 0/3 passing | d43179e8fd4b |
| US-007 | EPIC-003 | Mark a habit done with one tap and undo with a second | US-007 | 2 | PUT /habits/{habit_id}/today, api, completions, database, habits, web_spa | — | 35cdd43 | delivered | not run | 4/4 tested · 0/4 passing | — |
| US-008 | EPIC-004 | See the current streak next to each habit | US-008 | 2 | GET /habits, PUT /habits/{habit_id}/today, api, completions, habits, web_spa | — | 35cdd43 | delivered | not run | 1/6 tested · 0/6 passing | — |
| US-009 | EPIC-005 | Use the app on phone and desktop browsers | US-009 | 3 | web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-010 | EPIC-006 | Store data in PostgreSQL | US-010 | 1 | GET /health, api, completions, database, habits, sessions, users | — | b55e4e6 | delivered | not run | 2/2 tested · 0/2 passing | d43179e8fd4b |
| US-011 | EPIC-006 | Setup and usage guide | US-011, US-011-T1, US-011-T2, US-011-T3 | 3 | GET /health, api, secrets, web_spa | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
<!-- sdlc:auto:end matrix -->
