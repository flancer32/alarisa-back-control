# Code Documentation

- Path: `ctx/docs/code/AGENTS.md`
- Changed: `20260717`

## Purpose

Maps the current exploratory implementation to the accepted architecture and defines its verification boundary.

## Level Map

- `modules.md` — TeqFW component addressing and source boundary.
- `verification.md` — required checks and deterministic scenarios.

## Level Boundary

Describe implemented facts and verification only. Do not redefine product or target architecture to fit an exploratory shortcut. `src/` follows TeqFW ESM rules; tests and the probe may use Node.js imports as composition boundaries, while source components must not use static imports or manual container lookup.
