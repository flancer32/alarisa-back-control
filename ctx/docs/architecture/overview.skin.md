# Control Plane Architecture Overview

- Path: `ctx/docs/architecture/overview.skin.md`
- Changed: `20260717`

## Purpose

Keep the target Control Plane architecture distinct from the current Message Interpretation experiment.

## Mental Model

Interpretation prepares a proposal; the Control Plane governs whether that meaning can affect Alarisa's next move. State, execution, communication, and host composition remain separate owners.

## Scope

Includes:

- Target interpretation components and their responsibility boundaries.
- Explicit current implementation status and research gaps.

Excludes:

- Treating model output as authoritative application.
- Turning package boundaries into separately deployed services.

## Invariants

- Control Plane owns interpretation policy, not durable state or execution.
- One logical session remains authoritative over any provider session.
- A valid Deep response still requires comparison and control validation.

## Agent Document

`overview.md`
