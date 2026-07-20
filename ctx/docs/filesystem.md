# Filesystem Structure

- Path: `ctx/docs/filesystem.md`
- Changed: `20260717`

## Purpose

Maps only the top-level host repository structure. Local subdirectory maps belong in their own `AGENTS.md` files.

## Root Structure

- `bin/` — deterministic local probe entry point.
- `ctx/` — authoritative cognitive context for this package.
- `scenarios/` — deterministic probe inputs.
- `src/` — provider-neutral TeqFW components and deterministic adapters.
- `test/` — deterministic verification.

## Root Files

- `AGENTS.md` — root-level working rules.
- `package.json` — package metadata, dependencies, and commands.
- `types.d.ts` — TeqFW JSDoc aliases for source components.

## Scope Rule

This document does not define product meaning, architecture, or subdirectory contents. `ctx/docs/` is the authoritative documentation corpus; source, test, and scenario details are documented only at the code level.
