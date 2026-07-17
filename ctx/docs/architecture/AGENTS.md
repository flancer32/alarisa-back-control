# Architecture Documentation

- Path: `ctx/docs/architecture/AGENTS.md`
- Changed: `20260717`

## Purpose

Refines accepted product meaning into the target Control Plane architecture and records the narrower exploratory implementation separately.

## Level Map

- `behavior.md` — interpretation flow and result handling.
- `constraints.md` — non-negotiable architectural rules.
- `decisions.md` — accepted decisions and explicit research questions.
- `integration.md` — external and package boundaries.
- `overview.md` and `overview.skin.md` — architecture entry point and human-facing semantic control.
- `state.md` — logical and provider session state.
- `structure.md` — component responsibilities and dependency direction.

## Level Boundary

Architecture may refine, but not redefine, product semantics. Keep state ownership in `back-state`, execution in `back-exec`, shared communication contracts in `comm`, and global HTTP composition in `@flancer32/alarisa`. Clearly label target architecture, current reconnaissance implementation, and undecided research questions.
