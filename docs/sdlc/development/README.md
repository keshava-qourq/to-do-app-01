# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

The development plan is approved at version 1. It covers 6 epics, 11 stories and 3 tasks across 3 sprints of capacity 20 each. Stories total 45 points.

- Plan status: approved, version 1. Approver and date not stated.
- Sprints: Sprint 1, Sprint 2, Sprint 3; each has capacity 20 (total 60).
- Epics have no points and no role assigned:
  - EPIC-001 Accounts and sign-in
  - EPIC-002 Habit management
  - EPIC-003 Today screen and daily check-off
  - EPIC-004 Streaks
  - EPIC-005 Responsive layout
  - EPIC-006 Setup, storage and operation
- Stories (points, role):
  - US-001 Sign up with email and password (5, backend-agent)
  - US-002 Sign in and sign out (5, backend-agent)
  - US-003 Each user sees only their own habits (3, security-agent)
  - US-004 Add a habit (3, backend-agent)
  - US-005 Delete a habit (3, backend-agent)
  - US-006 See my habits on the Today screen (5, frontend-agent)
  - US-007 Mark a habit done with one tap and undo with a second (5, backend-agent)
  - US-008 See the current streak next to each habit (5, backend-agent)
  - US-009 Use the app on phone and desktop browsers (3, frontend-agent)
  - US-010 Store data in PostgreSQL (3, backend-agent)
  - US-011 Setup and usage guide (5, devops-agent)
- Tasks under US-011 (no points given):
  - T1 Add single-container build (devops-agent)
  - T2 Implement start-up settings check (backend-agent)
  - T3 Write setup and usage guide (devops-agent)
- Item-to-sprint assignment is not given explicitly; only the sprint goals indicate intended scope.
- Naming discrepancy recorded, not resolved: the project name is 'To Do app', but the description says 'a very basic habit tracker web app'. All plan items describe habit tracking.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 is the foundation sprint. It covers the persistent schema, account sign-up/sign-in/sign-out with sessions, and the Today screen habit list.

- Goal: Foundation: persistent schema, account sign-up/sign-in/sign-out with sessions, and the Today screen listing a user's habits.
- Capacity: 20.
- Items whose titles match the goal: US-010 (schema/PostgreSQL), US-001, US-002 and US-006. This is inferred from the goal text, not from an explicit assignment.
- All four matching tickets are reported delivered (see DEV-US-001, DEV-US-002, DEV-US-006, DEV-US-010). Their points total 18 of capacity 20.

**Related:** US-001, US-002, US-006, US-010, EPIC-001, EPIC-003, EPIC-006

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 covers the core habit loop: add, delete, one-tap done/undo, streaks and per-user privacy. No ticket results were reported for any item in this goal.

- Goal: Core habit loop: add, delete, one-tap done/undo, streaks, and enforced per-user privacy on all habit requests.
- Capacity: 20.
- Items whose titles match the goal (inferred): US-004, US-005, US-007, US-008 and US-003. Their points total 19.
- Delivery status: not reported in the development run input.

**Related:** US-003, US-004, US-005, US-007, US-008, EPIC-001, EPIC-002, EPIC-003, EPIC-004

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers polish and operability: responsive layout, single-container run, start-up settings check, and the setup and usage guide. No ticket results were reported for any item in this goal.

- Goal: Polish and operability: responsive phone/desktop layout, single-container run, start-up settings check, and the setup and usage guide.
- Capacity: 20.
- Items whose titles match the goal (inferred): US-009, plus US-011 with tasks T1, T2 and T3. Story points total 8.
- Delivery status: not reported in the development run input.

**Related:** US-009, US-011, US-011-T1, US-011-T2, US-011-T3, EPIC-005, EPIC-006

### DEV-US-001 · draft · source: dev:US-001

Ticket US-001, sign up with email and password, is reported as delivered.

- Ticket status: delivered.
- Commit: b55e4e6673afb8dacf3c07f60ea6184bab71076e.
- Plan: 5 points, backend-agent.
- Not provided: implementation details, review or approval, test results, delivery date.
- Entry status stays draft until review or test evidence is supplied.

**Related:** US-001, EPIC-001, DEV-SPRINT-1

### DEV-US-002 · draft · source: dev:US-002

Ticket US-002, sign in and sign out, is reported as delivered.

- Ticket status: delivered.
- Commit: b55e4e6673afb8dacf3c07f60ea6184bab71076e.
- Plan: 5 points, backend-agent.
- The Sprint 1 goal mentions sessions; the ticket input does not describe the session mechanism.
- Not provided: review, test results, delivery date.

**Related:** US-002, EPIC-001, DEV-SPRINT-1

### DEV-US-006 · draft · source: dev:US-006

Ticket US-006, see my habits on the Today screen, is reported as delivered.

- Ticket status: delivered.
- Commit: b55e4e6673afb8dacf3c07f60ea6184bab71076e.
- Plan: 5 points, frontend-agent.
- Scope as titled: listing habits on the Today screen.
- Done/undo (US-007) and streak display (US-008) are separate stories with no reported ticket.
- Not provided: review, test results, delivery date.

**Related:** US-006, EPIC-003, DEV-SPRINT-1

### DEV-US-010 · draft · source: dev:US-010

Ticket US-010, store data in PostgreSQL, is reported as delivered.

- Ticket status: delivered.
- Commit: b55e4e6673afb8dacf3c07f60ea6184bab71076e.
- Plan: 3 points, backend-agent.
- Schema details were not provided.
- Not provided: review, test results, delivery date.

**Related:** US-010, EPIC-006, DEV-SPRINT-1

### DEV-RUN-STATUS · draft · source: dev:run

The development run is marked completed, but it reports only 4 of the 11 planned stories. All 4 were delivered in a single commit.

- Run status: completed.
- Delivered tickets: US-001, US-002, US-006, US-010.
  - These total 18 points of the 45 planned.
  - All four share commit b55e4e6673afb8dacf3c07f60ea6184bab71076e.
- Conflict recorded, not resolved:
  - The run is marked 'completed'.
  - The approved plan includes 7 more stories and 3 tasks with no reported ticket outcome (see DEV-GAPS).
  - The input does not say whether the run was scoped to Sprint 1 only or covered the whole plan.

**Related:** US-001, US-002, US-006, US-010, DEV-PLAN-V1

### DEV-GAPS · draft · source: plan:v1

Seven planned stories and three tasks have no ticket outcome in the development run. Their delivery status is unknown and is not assumed either way.

Items with no reported ticket:
- US-003 Each user sees only their own habits (security-agent, 3 pts). The project description requires per-user privacy; enforcement is unconfirmed.
- US-004 Add a habit (3 pts). The 100-character name limit is unconfirmed.
- US-005 Delete a habit (3 pts).
- US-007 One-tap done / second-tap undo (5 pts).
- US-008 Current streak next to each habit (5 pts).
- US-009 Phone and desktop browsers (3 pts).
- US-011 Setup and usage guide (5 pts), plus tasks T1 (single-container build), T2 (start-up settings check) and T3 (write guide).

Action needed: obtain ticket status and commits for these items before treating the application as feature-complete against the project description.

**Related:** US-003, US-004, US-005, US-007, US-008, US-009, US-011, US-011-T1, US-011-T2, US-011-T3
<!-- sdlc:auto:end narrative -->
