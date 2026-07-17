# Message Interpretation Behaviour

- Path: `ctx/docs/architecture/behavior.md`
- Changed: `20260717`

## Purpose

Defines accepted target behaviour for interpreting an accepted Principal Message. It separates session-transition determination, semantic interpretation, interpretation-quality evaluation, Control Plane authorization, and durable commitment; it also identifies where the current reconnaissance implementation is narrower.

## Target Flow

```text
Accepted Principal Message
        ↓
load one current logical Interpretation Session and relevant Principal Representation projection
        ↓
determine whether strong deterministic evidence pre-selects start_new
        ├── yes → build clean new-session Interpretation Context → Primary → normalize
        └── no  → build provisional current-session context → Primary → normalize
                         ├── proposal says continue → Interpretation Gate
                         └── proposal says start_new → rebuild clean context → Primary again → normalize → Interpretation Gate
        ↓
Gate: accept | clarify | escalate | fail
        ↓
when escalated: build transition-consistent Deep context → Deep → normalize → compare/arbitrate → Gate
        ↓
final Semantic Interpretation Proposal
        ↓
wider Control Plane validates and authorizes semantic effects
        ↓
owning durable-state components commit authorized changes
```

## Entry and Session Selection

Message Interpretation begins only with an accepted Principal Message and its trusted ingress metadata. It loads the one current logical Interpretation Session through the Session Manager and a relevant projection of Principal Representation, which contains the relevant Principal Model and Principal State projections. A missing current session is handled as a policy-defined new-session recovery case.

The Session Manager first examines deterministic control-level evidence. It may pre-determine `start_new` for an explicit new-conversation action, an explicit Principal instruction to reset or begin a topic, an independent system trigger, unavailable session state when recovery policy requires rebuilding, or another unambiguous control marker. Time distance by itself is only evidence and must never pre-determine the transition.

When such evidence selects `start_new`, the Context Builder creates a clean new-session context before Primary runs. This path makes one Primary call; it does not introduce an unconditional double interpretation. The selected transition remains subject to later interpretation-quality policy, but the prior session frame is not supplied as active context.

## Provisional Continuation and Semantic `start_new`

Without decisive metadata, the current session is a hypothesis. The Context Builder forms a provisional continuation context from its useful local conversational frame: connected history, unresolved references, temporary alternatives, pending questions, expected next move, plus the relevant durable projections and the current Message. Primary interprets the Message, and the Normalizer / Validator first establishes whether its proposal is structurally usable.

If the normalized proposal says `continue`, it proceeds to the Interpretation Gate. If it says `start_new`, that result is **not** the final semantic interpretation of the Message. It is a request to rebuild context: the Coordinator discards the previous session's local conversational history from active context, creates a clean new-session context, and interprets the same Message again.

The rebuilt context may include relevant Principal Model and Principal State projections, trigger context, explicit reply target, relevant durable Cases and accepted decisions, and the current Message. It may include an old Message or event only when `replyTo`, trigger metadata, or durable retrieval explicitly makes that item relevant. That inclusion does not continue the prior Interpretation Session. The second normalized proposal, not the first `start_new` proposal, proceeds to the Gate. A transition conflict in the second proposal is handled by Gate policy, escalation, clarification, or failure; the attempt never silently restores the old local frame.

The extra Primary call for a semantically detected transition is an accepted latency and cost of protecting interpretation quality. It must be measured along with context size, escalation, clarification, and interpretation quality; it is not required when `start_new` was already established before interpretation.

## Normalization and Interpretation Gate

The Normalizer / Validator converts provider output into the common proposal schema, rejects malformed output, missing required fields, and unknown enum values, and keeps provider diagnostics separate from semantic meaning. It is a structural stage, not a semantic authority or a Gate decision.

The Gate evaluates a transition-consistent normalized proposal: schema and completeness; unresolved ambiguity or references; contradictions with supplied Principal Representation or session evidence; expected-answer alignment; consequence and risk; requests for more context; latency or failure; and configured quality policy. `accept` means the proposal is sufficient for the wider Control Plane to assess; it does not commit a candidate Signal or state change. `clarify` requests needed Principal input. `escalate` selects Deep interpretation. `fail` records a transparent safe failure when no acceptable result is available.

## Deep Escalation and Disagreement

Deep receives a context consistent with the selected `continue` or clean `start_new` transition. It may add deliberately retrieved durable information or other allowed context, but may not reintroduce excluded prior local history into a clean new-session interpretation. Where practical it starts independently from Primary to reduce anchoring.

Deep output passes the same normalization and Gate rules. Compatible Primary and Deep results may be combined or the more complete supported result selected. Material disagreement requires explicit arbitration, clarification, or failure. Schema-valid Deep output alone is never sufficient for acceptance.

## Authorization and Durable Commitment

A final Semantic Interpretation Proposal is still provisional. The wider Control Plane checks authority, confirmation requirements, causal relation, consequences, and its wider policy. It decides which semantic effects are authorized and coordinates an authoritative domain command or change request for each effect with the component that owns the affected durable data.

The owning component commits its change to the relevant part of Principal Representation, including Principal State where affected, Activity, Cases, accepted decisions, or Signals. The Control Plane may coordinate that commitment but does not become the physical durable-state owner. A candidate Signal becomes authoritative only through this authorization-and-owner-commitment path; neither Primary, Deep, the Gate, nor a provider can commit it directly.

## Provider Recovery

Losing or replacing a provider LLM session must not end the logical Interpretation Session. The Session Manager reconstructs a bounded context from Control Plane-defined logical-session data and relevant Principal Representation projections; a provider session may then be recreated or omitted.

## Current Exploratory Behaviour and Gaps

The current `Plane` reads one supplied session plus all configured representation payloads, state payloads, and Cases. Before Primary it uses an embedded shortcut: no current session starts new; an existing `replyTo` continues; otherwise a configured time gap decides continuity. This shortcut builds either a current-session or clean context before the first call, but it has no semantic `start_new` detection and no rebuild-and-reinterpret path. It is not target session policy.

The current slice invokes Primary, applies several deterministic Gate checks, and escalates to Deep on non-accept. Deep receives the same context and a schema-valid Deep result is selected without comparison, re-Gating, expanded retrieval, or arbitration. The proposal validator fills defaults for omitted fields and retains unknown fields, so it does not yet meet the target strict required-field and provider-diagnostic rules. The slice has no accepted-ingress implementation, Control Plane authorization stage, or authoritative state or Signal commitment.
