# Root Level

- Path: `AGENTS.md`
- Template Version: `20260702`
- Changed: `20260717`

## Purpose

Defines root-level working rules for this package repository.

## ADSM Project Model

The software product is outside `ctx/`. The cognitive context in `ctx/` is the authoritative project memory. Read `ctx/AGENTS.md` and `ctx/docs/filesystem.md` before making product changes.

## Boundaries

This package is a working backend module of the Alarisa modular monolith. It may provide an inbound HTTP pipeline handler, which the host composition root registers. It must not acquire UI, global HTTP hosting or route ownership, database ownership, authentication policy, task orchestration, or committed-Signal responsibilities.

Do not publish the package while `private` is `true`.
