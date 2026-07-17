# Control Plane Architecture Overview

- Path: `ctx/docs/architecture/overview.md`
- Changed: `20260717`

## Purpose

Defines the target architecture for the Control Plane responsibility area and separates it from the current Message Interpretation reconnaissance implementation.

## Target Architecture

The Control Plane controls Alarisa's next cognitive and operational move. Message Interpretation is one subsystem: it turns an accepted Principal Message into a provisional Semantic Interpretation Proposal. The wider Control Plane validates proposed meaning, authorizes any permitted semantic effects, and determines whether to clarify, transform, delegate, or otherwise continue.

Authorization does not make the Control Plane the durable owner of every affected object. For an authorized effect, it coordinates an authoritative domain command or change request with the component that owns the relevant Principal Representation, including its Principal State, Activity, Case, accepted decision, or Signal. That component commits its durable change.

The target Message Interpretation subsystem comprises an Interpretation Coordinator, Interpretation Session Manager, Interpretation Context Builder, Primary Message Interpreter, Interpretation Gate, Deep Message Interpreter, and Proposal Normalizer / Validator. Their responsibilities and dependency direction are defined in [structure.md](structure.md); the complete session and proposal flow is defined in [behavior.md](behavior.md).

## Package Boundaries

- `alarisa-back-control` owns Control Plane coordination, Message Interpretation policy, and Interpretation Session semantics.
- `alarisa-back-state` owns Principal Representation and durable state assigned to it.
- `alarisa-back-exec` owns agent, worker, tool, and execution work.
- `alarisa-comm-*` owns shared communication contracts and transport adapters.
- `@flancer32/alarisa` owns server composition, global routes, listener lifecycle, and host integration.

Interpretation Session storage may be delegated to `alarisa-back-state`, another infrastructure store, or an injected adapter. Delegation of physical persistence never transfers the Control Plane's semantic ownership of session continuity. These are modular-monolith package boundaries, not a required deployment topology. Detailed ingress and integration boundaries are in [integration.md](integration.md).

## Current Exploratory Slice

The present implementation is deliberately narrower than the target. `Plane.mjs` coordinates a supplied reader, a single in-memory session-store contract, scripted Primary and Deep model clients, a proposal validator, and an embedded Gate. It returns a proposal and has no writer for Signals, Activity, Principal Representation, Cases, or execution.

This slice demonstrates one current session value, provider-neutral adapters, Primary then optional Deep handling, bounded timeout, and deterministic probes. It does not implement accepted ingress, semantic session-transition detection and re-interpretation, durable or relevance-aware state retrieval, separate target components, a provider-session adapter, a production model client, Deep-result comparison, or Control Plane authorization and coordinated commitment.

## Architectural Status Rules

Target documents state the accepted direction. Current implementation facts are recorded only to expose gaps; they do not redefine target behaviour. Research questions are explicitly separated in [decisions.md](decisions.md). The state model is in [state.md](state.md) and non-negotiable rules are in [constraints.md](constraints.md).

## Documentation Map

- [structure.md](structure.md) — target components and current module mapping.
- [behavior.md](behavior.md) — session, context, Primary, Gate, Deep, and commitment behaviour.
- [state.md](state.md) — semantic session ownership, storage boundary, and provider-session model.
- [integration.md](integration.md) — package, ingress, storage, and commitment boundaries.
- [constraints.md](constraints.md) — architectural invariants.
- [decisions.md](decisions.md) — accepted decisions and research questions.
- [overview.skin.md](overview.skin.md) — compact human-facing semantic control.
