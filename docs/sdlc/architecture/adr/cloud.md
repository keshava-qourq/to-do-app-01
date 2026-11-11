<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-11

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- GCP
- Azure

## Decision Outcome

Chosen option: AWS, because The setup is minimal: App Runner for the single API container, RDS for PostgreSQL 16, S3/CloudFront for the SPA origin, and Secrets Manager for the two settings.

## Consequences

App Runner is less flexible than ECS, but it is the least operational work at this scale.
<!-- sdlc:auto:end adr -->