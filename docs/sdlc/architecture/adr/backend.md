<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-11

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Express
- Django REST framework

## Decision Outcome

Chosen option: FastAPI 0.115, because Pydantic validation covers the email, password and 1..100 character name rules with field-level errors. Dependency injection gives a single current_user guard for ownership scoping.

## Consequences

Sessions are hand-rolled (an opaque token table) rather than a framework auth package. This is simple, but the code must be careful about constant-time behaviour.
<!-- sdlc:auto:end adr -->