# Message Interpretation Behaviour

- Path: `ctx/docs/architecture/behavior.md`
- Changed: `20260717`

## Purpose

Defines accepted target behaviour for interpreting an accepted Principal Message and identifies where the current reconnaissance implementation is narrower.

## Target Flow

```text
Accepted Principal Message
        ↓
load current logical Interpretation Session
        ↓
load relevant Principal Representation and State
        ↓
build bounded Interpretation Context
        ↓
Primary Message Interpreter
        ↓
normalize and validate proposal
        ↓
Interpretation Gate
        ↓
accept | clarify | escalate | fail
        ↓
when escalated: expand or rebuild context; run Deep; compare or arbitrate
        ↓
final Semantic Interpretation Proposal
        ↓
wider Control Plane validation outside model authority
        ↓
accepted Signal(s), clarification, or another control move
```

## Session Decision and Context

Each Message has exactly one session-level outcome: `continue` the current session or `start_new`. The decision is semantic and contextual, supported by deterministic metadata. Time distance, reply linkage, UI location, trigger metadata, and topic similarity are evidence, not standalone rules.

A continuing session contributes relevant local history, unresolved references, temporary alternatives, pending questions, and the current conversational frame. A new session starts from relevant Principal Model and State projections, trigger context, and the current Message. It does not use a previous-session textual summary as its primary semantic bridge.

## Primary and Gate

The Primary path optimises for low latency and compact output without pretending to be deterministic or non-intelligent. It must surface ambiguity and missing context. The Gate evaluates more than model-reported confidence: schema validity, completeness, unresolved ambiguity or references, supplied-representation and session contradictions, supported session transition, expected-answer alignment, consequence and risk, model requests for context, latency or failure, and configured quality policy.

`accept` means the proposal is sufficient for subsequent Control Plane validation, not that its candidate effects are already committed. `clarify` asks for needed Principal input. `escalate` selects Deep interpretation. `fail` preserves a transparent failure outcome when no safe result is available.

## Deep Result Selection

Deep may use expanded or rebuilt context and should be independent of the Primary output where practical. Compatible Primary and Deep results may be combined or the more complete supported result may be selected. Material disagreement requires clarification, explicit arbitration, or failure. Valid Deep JSON alone is not enough to accept a proposal: the result still needs comparison and policy validation.

## Provider Recovery

Losing or replacing a provider session must not end the logical session. The Session Manager rebuilds bounded context from Alarisa-owned session state and relevant Principal Representation; a provider session may then be recreated or omitted.

## Current Exploratory Behaviour and Gaps

The current `Plane` reads one supplied session and all configured representation, state, and Cases, then uses an embedded shortcut: an existing `replyTo` continues; otherwise a configured time gap decides continuity. This is an implementation shortcut, not the target semantic session policy.

It invokes Primary, applies several deterministic gate checks, and escalates to Deep on non-accept. Deep currently receives the same context and a schema-valid Deep result is selected without comparison, re-gating, expanded retrieval, or arbitration. The proposal validator fills defaults for omitted fields and retains unknown fields, so it does not yet meet the target strict required-field and provider-diagnostic rules. The slice has no accepted-ingress implementation and no authoritative state or Signal application.
