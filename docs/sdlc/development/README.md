# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:v1

The development plan is approved at version 1. It defines 3 sprints of capacity 20 each and 6 epics. It covers the full in-scope feature set of the basic habit tracker. No implementation progress has been reported yet.

- Plan status: approved, version 1. Approver and approval date were not provided.
- Sprints: Sprint 1 (Foundation), Sprint 2 (Core habit loop), Sprint 3 (Polish and operability). Each sprint has capacity=20.
- Epics: EPIC-001 Accounts and sign-in; EPIC-002 Habit management; EPIC-003 Today screen and daily check-off; EPIC-004 Streaks; EPIC-005 Responsive layout; EPIC-006 Setup, storage and operation.
- Stories: US-001 to US-011, totalling 45 story points. Tasks: US-011-T1 to US-011-T3, unpointed.
- Epics have no points and no assigned role.
- Roles in use: backend-agent, frontend-agent, security-agent, devops-agent.
- Out of scope per project brief: reminders, history views, stats, sharing, editing past days.
- Naming discrepancy, recorded as given:
  - Project name is 'To Do app'.
  - Project description is 'Build a very basic habit tracker web app'.
  - All plan items describe a habit tracker.
- Implementation status: no development results were provided (no ticket completions, commits, PRs, or test outcomes).

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 is the foundation sprint. It covers the persistent schema, account sign-up, sign-in and sign-out with sessions, and the Today screen listing a user's habits. Capacity is 20.

- Goal (verbatim): Foundation: persistent schema, account sign-up/sign-in/sign-out with sessions, and the Today screen listing a user's habits.
- Capacity: 20.
- Explicit story-to-sprint assignment was not provided.
- The goal text corresponds to the following stories (inferred mapping, not stated):
  - US-010, Store data in PostgreSQL, 3 pts
  - US-001, Sign up, 5 pts
  - US-002, Sign in and sign out, 5 pts
  - US-006, See my habits on the Today screen, 5 pts
- That inferred set totals 18 pts, within capacity.
- Dates, progress and outcome: not provided.

**Related:** DEV-PLAN-V1, US-010, US-001, US-002, US-006

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 delivers the core habit loop: add, delete, one-tap done/undo, and streaks. It also enforces per-user privacy on all habit requests. Capacity is 20.

- Goal (verbatim): Core habit loop: add, delete, one-tap done/undo, streaks, and enforced per-user privacy on all habit requests.
- Capacity: 20.
- Explicit story-to-sprint assignment was not provided.
- The goal text corresponds to the following stories (inferred mapping, not stated):
  - US-004, Add a habit, 3 pts
  - US-005, Delete a habit, 3 pts
  - US-007, One-tap done/undo, 5 pts
  - US-008, Current streak, 5 pts
  - US-003, Own habits only, 3 pts
- That inferred set totals 19 pts, within capacity.
- Dates, progress and outcome: not provided.

**Related:** DEV-PLAN-V1, US-004, US-005, US-007, US-008, US-003

### DEV-SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 covers polish and operability. Planned work is a responsive phone/desktop layout, a single-container run, a start-up settings check, and the setup and usage guide. Capacity is 20.

- Goal (verbatim): Polish and operability: responsive phone/desktop layout, single-container run, start-up settings check, and the setup and usage guide.
- Capacity: 20.
- Explicit story-to-sprint assignment was not provided.
- The goal text corresponds to the following stories (inferred mapping, not stated):
  - US-009, Phone and desktop, 3 pts
  - US-011, Setup and usage guide, 5 pts, including tasks US-011-T1, US-011-T2 and US-011-T3
- That inferred set totals 8 pts.
- Dates, progress and outcome: not provided.

**Related:** DEV-PLAN-V1, US-009, US-011, US-011-T1, US-011-T2, US-011-T3

### EPIC-001 · approved · source: plan:EPIC-001

This epic covers accounts and sign-in: email/password sign-up, sign-in and sign-out, and per-user data isolation. Its three stories total 13 points.

- EPIC-001 'Accounts and sign-in': points=None, role unassigned.
- US-001 'Sign up with email and password': 5 pts, backend-agent.
- US-002 'Sign in and sign out': 5 pts, backend-agent. Sprint 1 goal mentions sessions.
- US-003 'Each user sees only their own habits': 3 pts, security-agent. Sprint 2 goal states privacy is to be enforced on all habit requests.
- Implementation status: not reported.

**Related:** US-001, US-002, US-003, DEV-SPRINT-1, DEV-SPRINT-2

### EPIC-002 · approved · source: plan:EPIC-002

This epic covers habit management: adding and deleting habits. Its two stories total 6 points.

- EPIC-002 'Habit management': points=None, role unassigned.
- US-004 'Add a habit': 3 pts, backend-agent. Project brief: a habit has a name, max 100 characters.
- US-005 'Delete a habit': 3 pts, backend-agent.
- Editing habits is not listed in the plan.
- Implementation status: not reported.

**Related:** US-004, US-005, DEV-SPRINT-2

### EPIC-003 · approved · source: plan:EPIC-003

This epic covers the Today screen and daily check-off. Users list their habits and toggle today's completion with a single tap. Its two stories total 10 points.

- EPIC-003 'Today screen and daily check-off': points=None, role unassigned.
- US-006 'See my habits on the Today screen': 5 pts, frontend-agent.
- US-007 'Mark a habit done with one tap and undo with a second': 5 pts, backend-agent.
- Out of scope per brief: editing past days.
- Implementation status: not reported.

**Related:** US-006, US-007, DEV-SPRINT-1, DEV-SPRINT-2

### EPIC-004 · approved · source: plan:EPIC-004

This epic covers streaks: showing the current consecutive-day streak next to each habit. It has one story of 5 points.

- EPIC-004 'Streaks': points=None, role unassigned.
- US-008 'See the current streak next to each habit': 5 pts, backend-agent.
- Brief defines a streak as days in a row done.
- Streak calculation rules were not provided, such as timezone or day-boundary handling, or treatment of today when not yet done.
- Implementation status: not reported.

**Related:** US-008, DEV-SPRINT-2

### EPIC-005 · approved · source: plan:EPIC-005

This epic covers a responsive layout so the app works in both phone and desktop browsers. It has one story of 3 points.

- EPIC-005 'Responsive layout': points=None, role unassigned.
- US-009 'Use the app on phone and desktop browsers': 3 pts, frontend-agent.
- Target browsers and breakpoints were not specified.
- Implementation status: not reported.

**Related:** US-009, DEV-SPRINT-3

### EPIC-006 · approved · source: plan:EPIC-006

This epic covers setup, storage and operation: PostgreSQL persistence, a single-container build, a start-up settings check, and a setup and usage guide. It has two stories totalling 8 points, plus three tasks.

- EPIC-006 'Setup, storage and operation': points=None, role unassigned.
- US-010 'Store data in PostgreSQL': 3 pts, backend-agent.
- US-011 'Setup and usage guide': 5 pts, devops-agent. Its tasks:
  - US-011-T1 'Add single-container build': devops-agent, unpointed.
  - US-011-T2 'Implement start-up settings check': backend-agent, unpointed.
  - US-011-T3 'Write setup and usage guide': devops-agent, unpointed.
- Specific settings validated at start-up and container details were not provided.
- Implementation status: not reported.

**Related:** US-010, US-011, US-011-T1, US-011-T2, US-011-T3, DEV-SPRINT-1, DEV-SPRINT-3
<!-- sdlc:auto:end narrative -->
