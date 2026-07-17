# Control Plane Product Overview

- Path: `ctx/docs/product/overview.md`
- Changed: `20260717`

## Purpose

`@flancer32/alarisa-back-control` is the intended package boundary for Alarisa's server-side Control Plane. The Control Plane controls the Representative's cognitive and operational next move for the one Principal served by an Alarisa instance.

Message Interpretation is the first independently explored vertical slice of that future responsibility. It receives an already accepted Principal Message and produces a provisional Semantic Interpretation Proposal. It is not the whole Control Plane and it is not a generic model wrapper.

## Product Position

The package belongs to the Alarisa modular monolith. A package boundary expresses responsibility, not a separately deployed process or service.

- `alarisa-back-control` — Control Plane and Message Interpretation.
- `alarisa-back-state` — future owner of Principal Representation and durable state.
- `alarisa-back-exec` — future agent, worker, tool, and execution responsibility.
- `alarisa-comm-*` — shared client/server communication contracts and adapters.
- `@flancer32/alarisa` — server composition root, global HTTP runtime, and route ownership.

Alarisa-wide package meaning and these boundaries are governed by the mounted `../alarisa/ctx` cognitive context, especially its package-area mapping. This package context narrows that meaning to the Control Plane responsibility area.

## Scope

The future Control Plane may interpret Principal Messages, validate proposed meaning, decide whether clarification or confirmation is needed, determine the next control move, coordinate access to Principal Representation, prepare delegated work, and decide how execution outcomes affect subsequent control flow.

The current package stage is functional reconnaissance. Its exploratory Message Interpretation slice is used to learn the minimum useful context, session-continuity evidence, gate checks, escalation policy, provider-session value, and stable proposal schema before the broader Control Plane is implemented.

## Boundaries

The package does not own durable Principal Representation, durable acceptance of transport payloads, authentication policy, global HTTP hosting or routes, agent or worker execution, or direct commitment of Signals and state changes.

The Message Interpreter does not turn a raw Message into an authoritative Signal. Its output is a provisional proposal. The wider Control Plane must validate, accept, reject, clarify, or transform that proposal before any authoritative Signal, trusted instruction, or durable state change can occur.

## Current Scope Versus Target

The current implementation is a deterministic, provider-neutral exploration of one Primary path, an embedded Gate, an optional Deep path, an in-memory current-session store, and scripted model clients. It does not implement accepted ingress, durable state ownership, production model integration, separate target components, proposal arbitration, or downstream Control Plane commitment.

Target architecture and current gaps are recorded in [architecture/overview.md](../architecture/overview.md) and [architecture/behavior.md](../architecture/behavior.md). The product objects and invariants are defined in [domain.md](domain.md); canonical vocabulary is defined in [glossary.md](glossary.md).

## Product Invariants

- One Alarisa instance serves exactly one Principal and has exactly one Representative: Alarisa.
- The Principal–Representative interaction has exactly one current logical Interpretation Session.
- A Case is an attention object, not a representative, conversation, or session owner.
- Every accepted Principal Message is interpreted provisionally before any authoritative semantic effect is considered.
- The Control Plane, not a model response or provider session, remains responsible for authority and continuity.

## Documentation Map

- [domain.md](domain.md) — product objects, relations, ownership, and invariants.
- [glossary.md](glossary.md) — required terminology and prohibited alternatives.
- [overview.skin.md](overview.skin.md) — compact human-facing semantic control for this document.
