# Control Plane Architecture Overview

- Path: `ctx/docs/architecture/overview.skin.md`
- Changed: `20260717`

## Purpose

Alarisa serves one Principal through one Representative. Its server-side Control Plane turns an accepted Principal Message into a safe next move without letting a model, provider, or store decide what is true.

## Mental Model

Message Interpretation flow: accepted Message → continuity → Context → Primary → Gate → optional Deep → final Semantic Interpretation Proposal → Control Plane decision. A `start_new` result from current context requests clean context and re-interpretation before final Gate evaluation.

One logical session may involve several Cases. Principal Representation provides durable basis through Model and State projections; provider LLM sessions are recoverable optimisations. Owners commit authorized durable changes.

## Scope

Includes:

- Target components, session policy, and authority boundaries.
- Gaps in the current deterministic exploration.

Excludes:

- Provider sessions as continuity truth or model output as Signal.
- Direct Control Plane ownership of all durable state or execution.

## Invariants

- The Control Plane semantically owns the one current logical Interpretation Session.
- `start_new` found in current context requires rebuild and re-interpretation.
- A Deep result still needs comparison, Gate evaluation, and authorization.

## Agent Document

`overview.md`
