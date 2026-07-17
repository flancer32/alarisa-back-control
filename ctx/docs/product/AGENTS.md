# Product Documentation

## Purpose

Defines the accepted meaning and limits of the Control Plane Message Interpreter module.

## Level Map

- `overview.md` — purpose, outcome, and exclusions.
- `glossary.md` — stable product terms used by all lower levels.

## Level Boundary

Do not introduce authority, authentication-policy, persistence ownership, execution, or Signal-commit semantics here. Architecture may define an inbound HTTP adapter, but it must not turn this module into the global HTTP host or trust-policy owner.
