# Control Plane Product Overview

- Path: `ctx/docs/product/overview.md`
- Changed: `20260717`

## Purpose

`@flancer32/alarisa-back-control` is the intended package boundary for Alarisa's server-side Control Plane. The Control Plane protects the single Principal–Representative relationship by controlling Alarisa's cognitive and operational next move for the one Principal served by an Alarisa instance.

Message Interpretation is the first independently explored vertical slice of that future responsibility. It receives an already accepted Principal Message and produces a provisional Semantic Interpretation Proposal. It is not the whole Control Plane and it is not a generic model wrapper.

## Product Position

The package belongs to the Alarisa modular monolith. A package boundary expresses responsibility, not a separately deployed process or service.

- `alarisa-back-control` — Control Plane coordination, Interpretation Session semantics, and Message Interpretation policy.
- `alarisa-back-state` — future owner of Principal Representation and other durable state.
- `alarisa-back-exec` — future agent, worker, tool, and execution responsibility.
- `alarisa-comm-*` — shared client/server communication contracts and adapters.
- `@flancer32/alarisa` — server composition root, global HTTP runtime, and route ownership.

Alarisa-wide package meaning and these boundaries are governed by the mounted `../alarisa/ctx` cognitive context, especially its package-area mapping. This package context narrows that meaning to the Control Plane responsibility area.

## Scope

The future Control Plane may interpret accepted Principal Messages, validate proposed meaning, decide whether clarification or confirmation is needed, determine the next control move, govern Interpretation Session continuity, coordinate access to Principal Representation, prepare delegated work, and decide how execution outcomes affect subsequent control flow.

The current package stage is functional reconnaissance. Its exploratory Message Interpretation slice is used to learn the minimum useful context, session-continuity evidence, Gate checks, escalation policy, provider-session value, and stable proposal schema before the broader Control Plane is implemented.

## Authority and Durable Effects

An accepted Message is evidence of communication, not a durable semantic effect. The Message Interpreter may only return a Semantic Interpretation Proposal. The Control Plane validates that proposal and decides which proposed semantic effects, if any, are authorized.

For every authorized effect, the Control Plane coordinates an authoritative domain command or change request with the component that owns the affected durable state. That owner commits the change. This distinction applies to Principal Representation, including its Principal State, Activity, Cases, accepted decisions, and Signals: the Control Plane may authorize and coordinate their change, but it does not thereby become their physical durable-state owner.

Thus, “apply interpretation” is only shorthand for control-level authorization and coordinated commitment; it never means that a model response writes a Signal or durable state directly.

## Boundaries

The package does not own durable Principal Representation, durable acceptance of transport payloads, authentication policy, global HTTP hosting or routes, agent or worker execution, or direct commitment of Signals and state changes.

The Control Plane semantically owns the Interpretation Session: its meaning, lifecycle, `continue | start_new` rules, current conversational frame, and context-transition invariants. Its physical persistence may be supplied by `alarisa-back-state`, another infrastructure store, or an injected adapter. A storage mechanism does not acquire session semantics by holding session data.

A provider LLM session is optional metadata beneath that logical session. It may be lost, recreated, or replaced; it cannot define conversational truth or be the only source from which continuity is reconstructed.

## Current Scope Versus Target

The current implementation is a deterministic, provider-neutral exploration of one Primary path, an embedded Gate, an optional Deep path, an in-memory current-session store, and scripted model clients. It does not implement accepted ingress, semantic session-transition detection with re-interpretation, durable state ownership, production model integration, separate target components, proposal arbitration, or downstream Control Plane authorization and coordinated commitment.

Target architecture and current gaps are recorded in [architecture/overview.md](../architecture/overview.md) and [architecture/behavior.md](../architecture/behavior.md). The product objects and invariants are defined in [domain.md](domain.md); canonical vocabulary is defined in [glossary.md](glossary.md).

## Product Invariants

- One Alarisa instance serves exactly one Principal and has exactly one Representative: Alarisa.
- The Principal–Representative interaction has exactly one current logical Interpretation Session.
- A Case is an attention object, not a representative, conversation, or session owner.
- Every accepted Principal Message is interpreted provisionally before any authoritative semantic effect is considered.
- The Control Plane, not a model response, storage adapter, provider session, or Case, remains responsible for authority and continuity.

## Documentation Map

- [domain.md](domain.md) — product objects, relations, ownership, and invariants.
- [glossary.md](glossary.md) — required terminology and prohibited alternatives.
- [overview.skin.md](overview.skin.md) — compact human-facing semantic control for this document.
