# Code Documentation

## Purpose

Maps the accepted architecture to source conventions and verification.

## Level Map

- `modules.md` — TeqFW component addressing and source boundary.
- `verification.md` — required checks and deterministic scenarios.

## Level Boundary

`src/` follows the TeqFW ESM module rules. Tests and the executable CLI may use Node.js imports as composition and test boundaries; source components must not use static imports or manual container lookup.
