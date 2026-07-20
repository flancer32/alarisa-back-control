# Documentation Level

- Path: `ctx/docs/AGENTS.md`
- Changed: `20260717`

## Purpose

Contains the authoritative package context for `@flancer32/alarisa-back-control`.

## Level Map

- `architecture/` — target Control Plane structure, behaviour, state, boundaries, constraints, and decisions.
- `code/` — current source mapping and verification.
- `environment/` — runtime assumptions and measurement boundary.
- `product/` — accepted meaning, domain model, and terminology.
- `filesystem.md` — context-root navigation only.

## Level Boundary

Read and refine documents in the order product, architecture, environment, and code. Keep documents in English. Ordinary documents are agent-facing; paired `*.skin.md` documents are human-facing semantic controls and must be read before their paired document is changed. Do not let lower levels redefine product meaning or represent exploratory code as target architecture. Escalate an upstream gap instead of inventing it downstream.
