# Control Plane Architecture Overview

- Path: `ctx/docs/architecture/overview.md`
- Changed: `20260717`

## Purpose

Defines the target architecture for the Control Plane responsibility area and separates it from the current Message Interpretation reconnaissance implementation.

## Target Architecture

The Control Plane controls Alarisa's next cognitive and operational move. Message Interpretation is one subsystem: it turns an accepted Principal Message into a provisional Semantic Interpretation Proposal. The wider Control Plane validates proposed meaning and determines whether to accept, clarify, transform, delegate, or otherwise continue; it alone may participate in authoritative application of meaning.

The target Message Interpretation subsystem comprises an Interpretation Coordinator, Interpretation Session Manager, Interpretation Context Builder, Primary Message Interpreter, Interpretation Gate, Deep Message Interpreter, and Proposal Normalizer / Validator. Their responsibilities and dependency direction are defined in [structure.md](structure.md); the flow is defined in [behavior.md](behavior.md).

## Package Boundaries

- `alarisa-back-control` owns Control Plane coordination and Message Interpretation policy.
- `alarisa-back-state` owns Principal Representation and durable state.
- `alarisa-back-exec` owns agent, worker, tool, and execution work.
- `alarisa-comm-*` owns shared communication contracts and transport adapters.
- `@flancer32/alarisa` owns server composition, global routes, listener lifecycle, and host integration.

These are modular-monolith package boundaries, not a required deployment topology. Detailed ingress and integration boundaries are in [integration.md](integration.md).

## Current Exploratory Slice

The present implementation is deliberately narrower than the target. `Plane.mjs` coordinates a supplied reader, a single in-memory session-store contract, scripted Primary and Deep model clients, a proposal validator, and an embedded gate. It returns a proposal and has no writer for Signals, Activity, Principal Representation, Cases, or execution.

This slice demonstrates one current session value, provider-neutral adapters, Primary then optional Deep handling, bounded timeout, and deterministic probes. It does not implement accepted ingress, durable or relevance-aware state retrieval, separate target components, a provider-session adapter, a production model client, Deep-result comparison, or authoritative Control Plane application.

## Architectural Status Rules

Target documents state the accepted direction. Current implementation facts are recorded only to expose gaps; they do not redefine target behaviour. Research questions are explicitly separated in [decisions.md](decisions.md). The state model is in [state.md](state.md) and non-negotiable rules are in [constraints.md](constraints.md).

## Documentation Map

- [structure.md](structure.md) — target components and current module mapping.
- [behavior.md](behavior.md) — session, context, Primary, Gate, and Deep behaviour.
- [state.md](state.md) — logical-session and provider-session model.
- [integration.md](integration.md) — package and ingress boundaries.
- [constraints.md](constraints.md) — architectural invariants.
- [decisions.md](decisions.md) — accepted decisions and research questions.
- [overview.skin.md](overview.skin.md) — compact human-facing semantic control.
