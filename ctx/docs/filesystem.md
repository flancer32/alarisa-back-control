# Filesystem Structure

- Path: `ctx/docs/filesystem.md`
- Changed: `20260717`

## Context

- `ctx/AGENTS.md` — context entry point.
- `ctx/adsm.json` — ADSM metadata.
- `ctx/docs/` — authoritative product and engineering documentation.

## Documentation Levels

- `product/` — accepted purpose and interpretation vocabulary.
- `architecture/` — component responsibilities and control flow.
- `environment/` — local execution boundary.
- `code/` — source mapping and verification.

## Host Repository

- `src/` — provider-neutral TeqFW components and deterministic adapters.
- `bin/probe.mjs` — standalone exploration entry point.
- `scenarios/` — deterministic probe inputs.
- `test/` — deterministic tests.
