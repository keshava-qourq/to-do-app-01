<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-11-11

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- MySQL
- SQLite

## Decision Outcome

Chosen option: PostgreSQL 16, because The unique constraint on (habit_id, done_on) makes repeated taps safe. ON DELETE CASCADE gives permanent removal of completions. Sessions also live here, so no cache is needed.

## Consequences

A managed instance costs more than an embedded database, but it gives durable data across redeploys.
<!-- sdlc:auto:end adr -->