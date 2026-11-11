# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-SCOPE · draft · source: requirements:scope

Requirements version 1 with a lightweight delivery scope. The project is a very basic habit tracker web app. It covers per-user private habits, daily check-off and streaks.

- Project name in input: 'To Do app'. The description says 'very basic habit tracker web app'. Both are recorded here. Every story and capability describes a habit tracker, not a to-do list.
- Delivery scope: lightweight. Requirements version: 1.
- Capabilities in scope:
  - Email/password sign-up and sign-in
  - Private habit list per user
  - Add a habit: name required, up to 100 characters
  - Today screen listing the user's habits
  - One tap marks a habit done for today; a second tap undoes it
  - Current streak shown next to each habit
  - Delete a habit
  - Responsive layout for phone and desktop browsers
  - Basic setup and usage guide
- Rules and constraints:
  - 'Today' is the calendar day in the user's browser timezone.
  - The streak counts days in a row ending today, or yesterday if today isn't done yet.
  - Deleting a habit permanently deletes its completion records.
  - No limit on the number of habits per user.
  - Habit renaming/editing is not included.
  - Free to use, no payments.
  - Sized for hundreds of users with tens of habits each.
- Out of scope (do not design or build): reminders, history views, stats, sharing, editing past days.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved the technology stack: FastAPI 0.115, React 19, PostgreSQL 16 and AWS. The design must use exactly these. The stack replaces an earlier Next.js full-stack assumption.

- Backend: FastAPI 0.115.
  - It was the only backend option offered.
  - The API is small: sign up, sign in, add a habit, delete a habit, mark done/undo, and list habits with streaks.
  - It validates inputs automatically, such as the 100-character limit and non-empty names.
  - It supports hashed passwords and secure cookie sessions.
  - Requires DATABASE_URL and SESSION_SECRET.
- Frontend: React 19.
  - Chosen as the closest match to the earlier Next.js assumption, because Next.js is not an available option.
  - Result: a React front end talks to a separate API, rather than one combined Next.js app.
  - A single-page layout adapts to phone and desktop.
- Database: PostgreSQL 16 (specified by the user).
  - Data model: users own habits, and habits have one completion record per day.
  - Linked rows allow a habit's completions to be removed permanently when it is deleted.
  - A uniqueness rule on habit + day makes the second tap a safe undo.
- Cloud: AWS (the only cloud offered).
  - Runs as one container with managed PostgreSQL.
  - SESSION_SECRET and DATABASE_URL are kept in AWS secrets storage.
  - Traffic is small and there is no deadline, so a minimal setup is enough.
- Recorded change: the earlier Next.js full-stack assumption was replaced by FastAPI + React.

**Related:** US-010, US-011, NFR-007, NFR-009, NFR-014

### EPIC-001 · draft · source: requirements:EPIC-001

Epic: Accounts and sign-in. It covers email/password sign-up, sign-in and sign-out, and per-user privacy of habits.

- Stories:
  - US-001 Sign up (critical)
  - US-002 Sign in and sign out (critical)
  - US-003 Each user sees only their own habits (critical)

**Related:** US-001, US-002, US-003

### US-001 · draft · source: requirements:US-001

Critical: a new visitor creates an account with an email and a password. They are then signed in and land on the Today screen.

- Story: new visitor creates an account with email and password to keep their own habits.
- AC-001: When there is no existing account and the email and password are valid, the account is created. The user is signed in and lands on the Today screen.
- AC-002: Signing up with an email that already exists is refused with a clear message. No second account is created.
- AC-003: An empty or malformed email, or an empty password, is rejected. The form shows which field needs correcting.
- AC-004: The password is stored only in hashed form, never as plain text.

**Related:** EPIC-001, AC-001, AC-002, AC-003, AC-004, NFR-001, NFR-013

### US-002 · draft · source: requirements:US-002

Critical: a registered user signs in with email and password and can sign out. Sessions expire, and signed-out access to habit data is denied.

- Story: registered user signs in and out so that only they can reach their habits.
- AC-005: Correct credentials take the user to the Today screen.
- AC-006: A wrong password or unknown email is refused with a generic message. The message does not reveal which part was wrong.
- AC-007: Sign-out ends the session. After that, the back button or the Today address asks the user to sign in again.
- AC-008: After the session lifetime passes, the session expires and the user must sign in again.
- AC-009: When not signed in, the Today screen and any direct habit data request are denied. No habit data is returned.
- The session lifetime value is not specified in the input.

**Related:** EPIC-001, AC-005, AC-006, AC-007, AC-008, AC-009, NFR-002, NFR-003, NFR-004

### US-003 · draft · source: requirements:US-003

Critical: each user's habits and check-offs are private. Other users cannot view or change them.

- AC-010: User A sees only user A's habits and streaks on the Today screen.
- AC-011: User A cannot mark done, undo or delete user B's habit, even by using its identifier directly. The request is refused and B's data is unchanged.

**Related:** EPIC-001, AC-010, AC-011, NFR-005

### EPIC-002 · draft · source: requirements:EPIC-002

Epic: Habit management. It covers adding and deleting habits.

- Stories:
  - US-004 Add a habit (critical)
  - US-005 Delete a habit (high)
- Renaming/editing is not included.

**Related:** US-004, US-005

### US-004 · draft · source: requirements:US-004

Critical: a signed-in user adds a habit with a name of 1 to 100 characters. There is no limit on how many habits a user can have.

- AC-012: A name of 1-100 characters, submitted from the Today screen, adds the habit to the list. It starts as not done today, with a streak of 0.
- AC-013: An empty or spaces-only name is rejected with a 'name is required' message.
- AC-014: A name over 100 characters is rejected with a 'name is too long' message. Alternatively, the input prevents typing more than 100 characters.
- AC-015: There is no limit on the number of habits per user.

**Related:** EPIC-002, AC-012, AC-013, AC-014, AC-015, NFR-005, NFR-009, NFR-013

### US-005 · draft · source: requirements:US-005

High: a signed-in user deletes a habit after confirming. The habit and all its completion records are permanently removed.

- AC-016: After delete + confirm, the habit disappears from Today and stays gone after a reload.
- AC-017: The habit's completion records are permanently deleted and cannot be recovered.
- AC-018: Cancelling at the confirmation leaves the habit and its records unchanged.

**Related:** EPIC-002, AC-016, AC-017, AC-018, NFR-005, NFR-006

### EPIC-003 · draft · source: requirements:EPIC-003

Epic: Today screen and daily check-off. It covers the habit list and one-tap done/undo for today.

- Stories:
  - US-006 See my habits on the Today screen (critical)
  - US-007 One-tap done / second-tap undo (critical)

**Related:** US-006, US-007

### US-006 · draft · source: requirements:US-006

Critical: the Today screen lists all of the user's habits with a done/not-done mark and the current streak. It shows an empty state when the user has no habits.

- AC-019: Every habit is listed with a clear done/not-done indicator for today and its current streak.
- AC-020: With no habits, an empty state invites the user to add their first habit.
- AC-021: 'Today' is the calendar day in the user's browser timezone.
  - Stated as an assumption: the timezone is recorded for the account at sign-up and sign-in.

**Related:** EPIC-003, AC-019, AC-020, AC-021, NFR-005, NFR-008, NFR-012

### US-007 · draft · source: requirements:US-007

Critical: one tap marks a habit done for today and a second tap undoes it. The state persists and is safe against rapid taps.

- AC-022: Tapping a not-done habit marks it done today. The change persists after a reload or sign-in on another device.
- AC-023: Tapping a done habit marks it not done and removes today's completion.
- AC-024: Rapid or repeated taps never create more than one completion per day. The displayed state matches the stored state.
- AC-025: There is no way to change previous days; only today can be changed.

**Related:** EPIC-003, AC-022, AC-023, AC-024, AC-025, NFR-005, NFR-008, NFR-010, NFR-012

### EPIC-004 · draft · source: requirements:EPIC-004

Epic: Streaks. It covers the current streak shown next to each habit.

- Stories:
  - US-008 See the current streak (high)

**Related:** US-008

### US-008 · draft · source: requirements:US-008

High: each habit shows its current streak. The streak is the unbroken run of done days ending today, or ending yesterday if today is not yet done.

- AC-026: Done on each of the last 3 days including today → streak 3.
- AC-027: Done on the last 3 days ending yesterday, not yet done today → streak 3, not 0.
  - Stated as an assumption: the streak ends yesterday until today is ticked.
- AC-028: Most recent done day is two or more days ago → streak 0.
- AC-029: With gaps, only the unbroken run ending today (or yesterday) counts.
- AC-030: The streak updates immediately when today is marked done or undone.
- AC-031: A habit that has never been done → streak 0.

**Related:** EPIC-004, AC-026, AC-027, AC-028, AC-029, AC-030, AC-031, NFR-012

### EPIC-005 · draft · source: requirements:EPIC-005

Epic: Responsive layout. It covers phone and desktop browsers.

- Stories:
  - US-009 Use the app on phone and desktop browsers (high)

**Related:** US-009

### US-009 · draft · source: requirements:US-009

High: all functions work on phone-sized and desktop-sized browser windows. The layout adapts when the window is resized.

- AC-032: On a phone, sign up, sign in, add, tick, undo and delete all fit on screen. There is no horizontal scrolling, and tap targets are large enough to hit reliably.
- AC-033: On desktop, the layout is readable and usable with mouse and keyboard.
- AC-034: Resizing between phone and desktop widths adapts the layout without losing any function.

**Related:** EPIC-005, AC-032, AC-033, AC-034, NFR-011

### EPIC-006 · draft · source: requirements:EPIC-006

Epic: Setup, storage and operation. It covers PostgreSQL persistence and the setup/usage guide.

- Stories:
  - US-010 Store data in PostgreSQL (high)
  - US-011 Setup and usage guide (medium)

**Related:** US-010, US-011

### US-010 · draft · source: requirements:US-010

High: all accounts, habits and completions are stored in PostgreSQL. Data persists across restarts and deployments and performs well at the expected usage.

- AC-035: After a restart, all users, habits, completions and streaks are unchanged.
- AC-036: With hundreds of users and tens of habits each, the Today screen loads and responds to ticks without noticeable delay.

**Related:** EPIC-006, AC-035, AC-036, NFR-007, NFR-008, NFR-009, REQ-STACK

### US-011 · draft · source: requirements:US-011

Medium: a short guide covers setup and basic use. The app also fails at start-up if a required setting is missing.

- AC-037: Following the guide, the operator can:
  - configure DATABASE_URL and SESSION_SECRET
  - start the app as a single container
  - reach the sign-up page
- AC-038: The usage section explains how to:
  - sign up
  - add a habit
  - tick and undo a habit
  - read the streak
  - delete a habit
  - It also states that reminders, history, stats, sharing and editing past days are not included.
- AC-039: If a required setting is missing, start-up fails with a message naming that setting, rather than running insecurely.

**Related:** EPIC-006, AC-037, AC-038, AC-039, NFR-014, NFR-015

### NFR-001 · draft · source: requirements:NFR-001

Security: passwords are stored only in hashed form.

- Inspecting the stored account data must not reveal any password.

**Related:** US-001, AC-004

### NFR-002 · draft · source: requirements:NFR-002

Security: sessions expire after a set lifetime, and sign-out ends the session immediately.

- After expiry or sign-out, the back button or the Today address requires signing in again.
- The lifetime value is not specified.

**Related:** US-002, AC-007, AC-008

### NFR-003 · draft · source: requirements:NFR-003

Security: signed-out visitors are denied the Today screen and every habit data request.

- Applies to direct calls too.
- No habit data may be returned to a signed-out visitor.

**Related:** US-002, AC-009

### NFR-004 · draft · source: requirements:NFR-004

Security: sign-in failure shows a generic message.

- The same message appears for a wrong password and an unknown email.
- It does not reveal which part was wrong.

**Related:** US-002, AC-006

### NFR-005 · draft · source: requirements:NFR-005

Privacy: habits, check-offs and streaks are visible and changeable only by their owner.

- Attempts to mark done, undo or delete another user's habit are refused, even by using its identifier directly.
- The other user's data stays unchanged.

**Related:** US-003, US-004, US-005, US-006, US-007, AC-010, AC-011

### NFR-006 · draft · source: requirements:NFR-006

Privacy: deleting a habit permanently removes all its completion records.

- The deleted records cannot be recovered.

**Related:** US-005, AC-017

### NFR-007 · draft · source: requirements:NFR-007

Availability: data in PostgreSQL survives restarts and redeployments.

- Covers users, habits, completions and streaks.

**Related:** US-010, AC-035

### NFR-008 · draft · source: requirements:NFR-008

Performance: at the expected usage, the Today screen loads and responds to ticks without noticeable delay.

- Expected usage: up to hundreds of users with tens of habits each.
- No numeric latency target is given.

**Related:** US-010, US-006, US-007, AC-036

### NFR-009 · draft · source: requirements:NFR-009

Scalability: the app is sized for hundreds of users with tens of habits each.

- No per-user habit limit.
- A minimal single-container setup is enough; larger scale is not required.
- Target: hundreds of users, tens of habits each.

**Related:** US-004, US-010, AC-015

### NFR-010 · draft · source: requirements:NFR-010

Maintainability: repeated taps never create duplicate completions.

- At most one completion per habit per day.
- The displayed state always matches the stored state.

**Related:** US-007, AC-024

### NFR-011 · draft · source: requirements:NFR-011

Compatibility: the app works on phone-sized and desktop-sized browser windows.

- Phone: no horizontal scrolling, and tap targets large enough to hit reliably.
- Desktop: usable with mouse and keyboard.
- Resizing adapts the layout without losing any function.

**Related:** US-009, AC-032, AC-033, AC-034

### NFR-012 · draft · source: requirements:NFR-012

Usability: 'today' follows the user's browser timezone.

- Done states and streaks match the user's own calendar day.

**Related:** US-006, US-007, US-008, AC-021

### NFR-013 · draft · source: requirements:NFR-013

Usability: rejected forms show which field needs correcting.

- Examples:
  - missing or malformed email
  - empty password
  - missing habit name
  - habit name over 100 characters

**Related:** US-001, US-004, AC-003, AC-013, AC-014

### NFR-014 · draft · source: requirements:NFR-014

Maintainability: start-up fails if DATABASE_URL or SESSION_SECRET is missing.

- The failure message names the missing setting.
- The app must not run insecurely.

**Related:** US-011, AC-039

### NFR-015 · draft · source: requirements:NFR-015

Maintainability: a short guide supports running the app as a single container.

- The guide covers configuring the required settings, starting the container and reaching the sign-up page.
- It also explains basic use and lists the excluded features.

**Related:** US-011, AC-037, AC-038

### NFR-016 · draft · source: requirements:NFR-016

Compliance (accepted risk): no regulatory requirements apply.

- Only an email and a password are held as personal data.
- There is no email verification, password reset or payment handling.
- Applies to the whole system.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-11

**Capabilities in scope:** Email and password sign-up and sign-in, Private habit list per user, Add a habit (required name, up to 100 characters), Today screen listing the user's habits, One-tap mark done for today, second tap to undo, Current streak shown next to each habit, Delete a habit, Responsive layout for phone and desktop browsers, Basic setup and usage guide, 'Today' is the calendar day in the user's browser timezone, Streak counts days in a row ending today, or yesterday if today isn't done yet, Deleting a habit permanently deletes its completion records, No limit on the number of habits per user, Habit renaming/editing not included, Free to use, no payments, Sized for hundreds of users with tens of habits each

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | This is the only backend option offered, and it fits. The API is small: sign up, sign in, add a habit, delete a habit, mark done or undo, and list habits with streaks. FastAPI checks inputs automatically, such as the 100-character habit name limit and non-empty names. It also supports hashed passwords and secure cookie sessions, so each user sees only their own habits. This replaces the earlier Next.js full-stack assumption, because Next.js is not an available option. Needs DATABASE_URL and SESSION_SECRET as assumed. |
| cloud | AWS | AWS is the only cloud offered. It can run the app as one container with a managed PostgreSQL database and keep SESSION_SECRET and DATABASE_URL in its secrets storage. That matches the single-container plan. Traffic is small and there is no deadline, so a minimal setup is enough. |
| database | PostgreSQL | You specified PostgreSQL. The data is simple and linked: users own habits, and habits have one completion record per day. Deleting a habit has to permanently remove its completion records, which PostgreSQL does cleanly with linked rows. A uniqueness rule on habit and day makes the second tap safely undo the first. Hundreds of users with tens of habits each is tiny for it. |
| frontend | React | The Today screen is a simple list with one-tap done/undo, and it needs to work on phones and desktops. React handles this well, and a single-page layout adapts to both screen sizes. The earlier assumption was Next.js, which is built on React. Next.js is not on the available list, so I picked plain React, its closest match. This also means the app is a React front end talking to a separate API, not one combined Next.js app. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Accounts and sign-in

### US-001: Sign up with email and password

**Priority:** critical

> As a new visitor, I want to create an account with my email and a password, so that I can keep my own habits.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am not signed in and no account exists for my email | I submit a valid email and a password on the sign-up form | an account is created, I am signed in, and I land on my Today screen |
| AC-002 | an account already exists for an email | I try to sign up with that same email | sign-up is refused with a clear message and no second account is created |
| AC-003 | I am on the sign-up form | I submit an empty or malformed email, or an empty password | the form is not accepted and I see which field needs correcting |
| AC-004 | an account has been created | the stored account data is inspected | the password is stored only in hashed form, never as plain text |

### US-002: Sign in and sign out

**Priority:** critical

> As a registered user, I want to sign in with my email and password and sign out when I am done, so that only I can reach my habits.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | I have an account | I sign in with the correct email and password | I am taken to my Today screen |
| AC-006 | I have an account | I sign in with a wrong password or an unknown email | sign-in is refused with a generic message that does not reveal which part was wrong |
| AC-007 | I am signed in | I choose to sign out | my session ends and using the back button or opening the Today address asks me to sign in again |
| AC-008 | I have been signed in for longer than the session lifetime | I next use the app | my session has expired and I am asked to sign in again |
| AC-009 | I am not signed in | I open the Today screen or call any habit data request directly | access is denied and no habit data is returned |

### US-003: Each user sees only their own habits

**Priority:** critical

> As a signed-in user, I want my habits and check-offs to be private to me, so that other users cannot see or change them.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | two users each have habits | user A views the Today screen | only user A's habits and streaks are shown |
| AC-011 | I am signed in as user A | I attempt to mark done, undo or delete a habit that belongs to user B (for example by using its identifier directly) | the request is refused and user B's data is unchanged |

## EPIC-002: Habit management

### US-004: Add a habit

**Priority:** critical

> As a signed-in user, I want to add a habit with a name, so that I can track it each day.

| ID | Given | When | Then |
|---|---|---|---|
| AC-012 | I am on the Today screen | I enter a name of 1 to 100 characters and submit | the habit appears in my list, not yet done today, with a streak of 0 |
| AC-013 | I am adding a habit | I submit an empty name or one containing only spaces | the habit is not created and I see that a name is required |
| AC-014 | I am adding a habit | I enter a name longer than 100 characters | the habit is not created and I see that the name is too long (or the input prevents more than 100 characters) |
| AC-015 | I already have many habits | I add another | it is added; the app imposes no limit on the number of habits per user |

### US-005: Delete a habit

**Priority:** high

> As a signed-in user, I want to delete a habit I no longer track, so that my list stays relevant.

| ID | Given | When | Then |
|---|---|---|---|
| AC-016 | I have a habit in my list | I delete it and confirm | it disappears from my Today screen and stays gone after reloading the page |
| AC-017 | a habit has completion records | I delete it | its completion records are permanently deleted and cannot be recovered |
| AC-018 | I start to delete a habit | I cancel at the confirmation | the habit and its records are unchanged |

## EPIC-003: Today screen and daily check-off

### US-006: See my habits on the Today screen

**Priority:** critical

> As a signed-in user, I want a Today screen listing all my habits with their done state, so that I can see at a glance what is left to do today.

| ID | Given | When | Then |
|---|---|---|---|
| AC-019 | I have habits | I open the Today screen | every one of my habits is listed with a clear done or not-done indicator for today and its current streak |
| AC-020 | I have no habits | I open the Today screen | I see an empty state that invites me to add my first habit |
| AC-021 | I am using the app | the app decides what 'today' is | it uses the calendar day in my browser's timezone (assumption: the timezone is recorded for my account at sign-up and sign-in) |

### US-007: Mark a habit done with one tap and undo with a second

**Priority:** critical

> As a signed-in user, I want to tap a habit once to mark it done today and tap again to undo, so that checking off is fast and mistakes are easy to fix.

| ID | Given | When | Then |
|---|---|---|---|
| AC-022 | a habit is not done today | I tap it once | it shows as done today and the change is still there after reloading or signing in on another device |
| AC-023 | a habit is done today | I tap it again | it shows as not done today and the completion for today is removed |
| AC-024 | a habit is done today | I tap it twice quickly or repeatedly | it never has more than one completion for that day and the displayed state matches the stored state |
| AC-025 | I am using the app | I look for a way to change the done state of a previous day | none is offered; only today can be changed |

## EPIC-004: Streaks

### US-008: See the current streak next to each habit

**Priority:** high

> As a signed-in user, I want to see how many days in a row I have done each habit, so that I stay motivated to keep going.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | a habit was done on each of the last 3 days including today | I view the Today screen | its streak shows 3 |
| AC-027 | a habit was done on the last 3 days ending yesterday and is not yet done today | I view the Today screen | its streak shows 3, not 0 (assumption: the streak ends yesterday until today is ticked) |
| AC-028 | a habit's most recent done day is two or more days ago | I view the Today screen | its streak shows 0 |
| AC-029 | a habit has a gap in its done days | I view its streak | only the unbroken run of days ending today (or yesterday if today is not done) is counted |
| AC-030 | a habit has a streak | I tap to mark today done or undo it | the streak updates immediately to reflect the change |
| AC-031 | a habit has never been done | I view it | its streak shows 0 |

## EPIC-005: Responsive layout

### US-009: Use the app on phone and desktop browsers

**Priority:** high

> As a user, I want the app to work well on both a phone and a desktop browser, so that I can check off habits wherever I am.

| ID | Given | When | Then |
|---|---|---|---|
| AC-032 | I use a phone-sized screen | I sign up, sign in, add, tick, undo and delete habits | all content fits without horizontal scrolling and tap targets are large enough to hit reliably |
| AC-033 | I use a desktop-sized browser window | I use the same functions | the layout is readable and usable with mouse and keyboard |
| AC-034 | I resize the window between phone and desktop widths | the page is displayed | the layout adapts without losing any function |

## EPIC-006: Setup, storage and operation

### US-010: Store data in PostgreSQL

**Priority:** high

> As a operator, I want all accounts, habits and completions stored in PostgreSQL, so that data persists across restarts and deployments.

| ID | Given | When | Then |
|---|---|---|---|
| AC-035 | the app is running and connected to PostgreSQL | the app is restarted | all users, habits, completions and streaks are unchanged |
| AC-036 | the expected usage of up to hundreds of users with tens of habits each | users load the Today screen and tick habits | the screen loads and responds without noticeable delay |

### US-011: Setup and usage guide

**Priority:** medium

> As a operator or new user, I want a short guide covering setup and basic use, so that I can run the app and use it without extra help.

| ID | Given | When | Then |
|---|---|---|---|
| AC-037 | I have the project and a PostgreSQL database | I follow the guide | I can configure the required DATABASE_URL and SESSION_SECRET settings, start the app as a single container, and reach the sign-up page |
| AC-038 | the guide | I read the usage section | it explains how to sign up, add a habit, tick and undo it, read the streak, and delete a habit, and states that reminders, history, stats, sharing and editing past days are not included |
| AC-039 | a required setting is missing at startup | the app starts | it fails with a message naming the missing setting rather than running insecurely |
<!-- sdlc:auto:end epics -->
