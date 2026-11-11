# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Foundation: persistent schema, account sign-up/sign-in/sign-out with sessions, and the Today screen listing a user's habits

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Sign up with email and password | 5 | backend-agent | US-010 |
| US-002 | Story | Sign in and sign out | 5 | backend-agent | US-001 |
| US-006 | Story | See my habits on the Today screen | 5 | frontend-agent | US-002 |
| US-010 | Story | Store data in PostgreSQL | 3 | backend-agent | — |

## Sprint 2: Sprint 2

Core habit loop: add, delete, one-tap done/undo, streaks, and enforced per-user privacy on all habit requests

Capacity: 20 points · Committed: 19

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-003 | Story | Each user sees only their own habits | 3 | security-agent | US-002, US-005, US-007 |
| US-004 | Story | Add a habit | 3 | backend-agent | US-006 |
| US-005 | Story | Delete a habit | 3 | backend-agent | US-004 |
| US-007 | Story | Mark a habit done with one tap and undo with a second | 5 | backend-agent | US-004 |
| US-008 | Story | See the current streak next to each habit | 5 | backend-agent | US-007 |

## Sprint 3: Sprint 3

Polish and operability: responsive phone/desktop layout, single-container run, start-up settings check, and the setup and usage guide

Capacity: 20 points · Committed: 8

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-009 | Story | Use the app on phone and desktop browsers | 3 | frontend-agent | US-001, US-002, US-005, US-008 |
| US-011 | Story | Setup and usage guide | 5 | devops-agent | US-010, US-009 |
| ↳ US-011-T1 | Task | Add single-container build | — | devops-agent | — |
| ↳ US-011-T2 | Task | Implement start-up settings check | — | backend-agent | — |
| ↳ US-011-T3 | Task | Write setup and usage guide | — | devops-agent | — |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
