<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-11-11

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because The Today screen is a small responsive list with optimistic one-tap updates, which React handles well. It is built with Vite as a static SPA and reads VITE_API_BASE_URL. The layout is mobile-first CSS with tap targets of at least 44px (NFR-011).

## Consequences

As a separate SPA it needs CORS and token handling, in exchange for simple static hosting.
<!-- sdlc:auto:end adr -->