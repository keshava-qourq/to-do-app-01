# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

Plan version 1 is approved and defines three sprints, each with capacity 20. It covers six epics and eleven stories. The input does not say which items belong to which sprint.

**Sprints**
- Sprint 1: Foundation. Persistent schema, account sign-up/sign-in/sign-out with sessions, and the Today screen listing a user's habits. Capacity 20.
- Sprint 2: Core habit loop. Add, delete, one-tap done/undo, streaks, and enforced per-user privacy on all habit requests. Capacity 20.
- Sprint 3: Polish and operability. Responsive phone/desktop layout, single-container run, start-up settings check, and the setup and usage guide. Capacity 20.

**Epics and stories (points, role)**
- EPIC-001 Accounts and sign-in
  - US-001 Sign up with email and password (5, backend-agent)
  - US-002 Sign in and sign out (5, backend-agent)
  - US-003 Each user sees only their own habits (3, security-agent)
- EPIC-002 Habit management
  - US-004 Add a habit (3, backend-agent)
  - US-005 Delete a habit (3, backend-agent)
- EPIC-003 Today screen and daily check-off
  - US-006 See my habits on the Today screen (5, frontend-agent)
  - US-007 Mark a habit done with one tap and undo with a second (5, backend-agent)
- EPIC-004 Streaks
  - US-008 See the current streak next to each habit (5, backend-agent)
- EPIC-005 Responsive layout
  - US-009 Use the app on phone and desktop browsers (3, frontend-agent)
- EPIC-006 Setup, storage and operation
  - US-010 Store data in PostgreSQL (3, backend-agent)
  - US-011 Setup and usage guide (5, devops-agent)
    - US-011-T1 Add single-container build (devops-agent)
    - US-011-T2 Implement start-up settings check (backend-agent)
    - US-011-T3 Write setup and usage guide (devops-agent)

**Not stated in input:** item-to-sprint assignment and the approver or approval date.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011

### DEV-US-003 · draft · source: dev:US-003

Ticket US-003 (each user sees only their own habits) is recorded as delivered. The plan assigns it to security-agent.

- Ticket: US-003 Each user sees only their own habits
- Status: delivered
- Commit: 35cdd43619a1fbbd4e58f5366a9ceaaff8b8cbdc
- Plan: 3 points, role security-agent
- Sprint 2 goal includes 'enforced per-user privacy on all habit requests'.
- Not provided: implementation approach, review outcome, test evidence.

**Related:** US-003

### DEV-US-004 · draft · source: dev:US-004

Ticket US-004 (add a habit) is recorded as delivered. The plan assigns it to backend-agent.

- Ticket: US-004 Add a habit
- Status: delivered
- Commit: 35cdd43619a1fbbd4e58f5366a9ceaaff8b8cbdc
- Plan: 3 points, role backend-agent
- Not provided: implementation details, test evidence.

**Related:** US-004

### DEV-US-005 · draft · source: dev:US-005

Ticket US-005 (delete a habit) is recorded as delivered. The plan assigns it to backend-agent.

- Ticket: US-005 Delete a habit
- Status: delivered
- Commit: 35cdd43619a1fbbd4e58f5366a9ceaaff8b8cbdc
- Plan: 3 points, role backend-agent
- Not provided: implementation details, test evidence.

**Related:** US-005

### DEV-US-007 · draft · source: dev:US-007

Ticket US-007 (mark a habit done with one tap, undo with a second) is recorded as delivered. The plan assigns it to backend-agent.

- Ticket: US-007 Mark a habit done with one tap and undo with a second
- Status: delivered
- Commit: 35cdd43619a1fbbd4e58f5366a9ceaaff8b8cbdc
- Plan: 5 points, role backend-agent
- Not provided: implementation details, test evidence.

**Related:** US-007

### DEV-US-008 · draft · source: dev:US-008

Ticket US-008 (current streak next to each habit) is recorded as delivered. The plan assigns it to backend-agent.

- Ticket: US-008 See the current streak next to each habit
- Status: delivered
- Commit: 35cdd43619a1fbbd4e58f5366a9ceaaff8b8cbdc
- Plan: 5 points, role backend-agent
- Not provided: how streak is computed in code, test evidence.

**Related:** US-008

### DEV-RUN-COVERAGE · draft · source: dev:run-status

The run status is 'completed', but ticket records exist for only 5 of the 11 planned stories. The input gives no delivery record for the other six, so their completion is unconfirmed.

**Delivered tickets (all at commit 35cdd43619a1fbbd4e58f5366a9ceaaff8b8cbdc):** US-003, US-004, US-005, US-007, US-008.

**Planned stories with no ticket record in the input:**
- US-001 Sign up with email and password
- US-002 Sign in and sign out
- US-006 See my habits on the Today screen
- US-009 Use the app on phone and desktop browsers
- US-010 Store data in PostgreSQL
- US-011 Setup and usage guide, including tasks US-011-T1, US-011-T2 and US-011-T3

**Why this matters:**
- These stories fall under the Sprint 1 and Sprint 3 goals.
- Whether they were implemented, merged into another commit, or skipped is not stated.
- This entry does not assume any of them was built.

**Follow-up for a human:** confirm the status of these items and supply their ticket records so this documentation can be completed.

**Related:** US-001, US-002, US-006, US-009, US-010, US-011, US-003, US-004, US-005, US-007, US-008
<!-- sdlc:auto:end narrative -->
