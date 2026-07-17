# Control Plane Decisions and Research Questions

- Path: `ctx/docs/architecture/decisions.md`
- Changed: `20260717`

## Purpose

Separates accepted architecture decisions from questions being explored by the current functional reconnaissance.

## Accepted Decisions

- `Message` is the canonical term for Principal input.
- One Principal and one Representative have one current logical Interpretation Session.
- Session outcomes are `continue` or `start_new`; a session may span multiple Cases and a Case may recur across sessions.
- Time, reply linkage, UI context, trigger metadata, and topic similarity are evidence, not absolute continuity rules.
- A new session is grounded in relevant Principal Representation and State, trigger context, and the current Message; old summaries are not the primary bridge.
- Principal Representation contains relatively stable Principal Model and dynamic Principal State and is durably owned outside this package.
- Primary Message Interpreter is the low-latency default; Deep Message Interpreter is the escalation path; Interpretation Gate makes an explicit quality decision.
- The interpreter emits a Semantic Interpretation Proposal, not an authoritative Signal or state mutation.
- Provider LLM sessions are replaceable implementation optimisations beneath the logical-session model.

## Functional Reconnaissance Questions

- What minimum Principal Representation is sufficient for a new session, and what must remain hot in the current-session context?
- Which metadata materially improves semantic session selection, and which Gate checks identify genuinely weak proposals?
- When does Deep improve interpretation, and when is clarification safer than Deep?
- How should compatible and materially conflicting Primary and Deep results be compared or arbitrated?
- How long does provider-session reuse remain useful as context grows or models change?
- What common proposal schema remains stable across providers while preserving diagnostics separately?
- Which Control Plane responsibilities should become permanent package components and which remain provider adapters?

## Working Hypotheses

These hypotheses guide measurement only; they are not accepted architecture.

- A bounded relevance projection and a hot local current-session context can improve normal-path latency without losing needed meaning.
- An initially independent Deep path can reduce anchoring when Primary is weak or consequential.
- Provider-session reuse can help dense connected communication, but its value declines when context growth, expiry, or model replacement makes reconstruction preferable.

## Measurements Required Before Policy Tightening

Functional reconnaissance must measure Primary and escalated latency, model and token cost, context size, escalation rate, malformed-output rate, clarification rate, and interpretation quality on known scenarios. These measures are required evidence, not fixed targets.

## Current Implementation Status

The current implementation confirms a narrow deterministic slice only. It still uses reply/time shortcuts, in-memory session state, supplied whole-object reads, scripted clients, and automatic selection of schema-valid Deep output. Those are implementation gaps described in [behavior.md](behavior.md), not accepted decisions.
