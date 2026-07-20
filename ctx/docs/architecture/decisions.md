# Control Plane Decisions and Research Questions

- Path: `ctx/docs/architecture/decisions.md`
- Changed: `20260717`

## Purpose

Separates accepted architecture decisions from questions being explored by the current functional reconnaissance.

## Accepted Decisions

- `Message` is the canonical term for Principal input.
- One Principal and one Representative have one current logical Interpretation Session. A session may span multiple Cases and a Case may recur across sessions.
- The Control Plane semantically owns the Interpretation Session: its meaning, lifecycle, current conversational frame, `continue | start_new` decision, recovery rules, and context-transition invariants.
- Session persistence may be physically delegated to `alarisa-back-state`, another infrastructure store, or an injected adapter. That delegation does not transfer session semantics.
- Session outcomes are `continue` or `start_new`. Time, reply linkage, UI context, trigger metadata, and topic similarity are evidence, not absolute continuity rules; elapsed time alone cannot pre-determine `start_new`.
- Strong deterministic control-level evidence may select `start_new` before Primary interpretation, so a clean new-session context can be used without a mandatory first call.
- A `start_new` proposal produced from provisional current-session context requests clean context reconstruction and re-interpretation of the Message. It is not the final semantic interpretation.
- A clean new-session context excludes the prior local conversational frame and is grounded in relevant Principal Representation, including relevant Principal Model and Principal State projections, the current Message, and relevant trigger or durable references. Old summaries are not the primary bridge.
- Principal Representation contains relatively stable Principal Model and dynamic Principal State.
- Primary Message Interpreter is the low-latency default; Deep Message Interpreter is the escalation path; Interpretation Gate makes an explicit quality decision.
- The interpreter emits a Semantic Interpretation Proposal, not an authoritative Signal or state mutation. The Control Plane validates and authorizes permitted semantic effects, then coordinates their commitment through the durable-state owner.
- Provider LLM sessions are replaceable implementation optimisations beneath the logical-session model.
- OpenAI may be used as the first provider adapter during functional reconnaissance. It remains behind the provider-neutral model-client boundary and does not alter Control Plane authority, logical-session semantics, or durable-state ownership.
- Live provider reconnaissance may send only public Principal data: data that is not confidential. A complete package scenario run may consume at most USD 0.10 in aggregate. Its purpose is to discover the main design directions, not to provide exhaustive functional verification.
- The first live smoke path uses one synthetic public scenario and Primary interpretation only. If its Gate requests escalation, the attempt fails locally without a paid Deep request.
- Live OpenAI configuration is an immutable Control-package DI component. Composition maps externally supplied runtime values into its factory before resolving adapters; provider adapters do not read process environment or environment files.

## Functional Reconnaissance Questions

- Which physical store or adapter will persist logical-session records while satisfying the Control Plane-defined semantic contract?
- What minimum Principal Representation projection is sufficient for a new session, and what must remain hot in the current-session context?
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

Functional reconnaissance must measure Primary and escalated latency, transition-reinterpretation latency, model and token cost, context size, escalation rate, malformed-output rate, clarification rate, and interpretation quality on known scenarios. These measures are required evidence, not fixed targets.

## Current Implementation Status

The current implementation confirms a narrow deterministic slice only. It still uses reply/time shortcuts before Primary, in-memory session state, supplied whole-object reads, scripted clients, and automatic selection of schema-valid Deep output. It has no semantic `start_new` rebuild-and-reinterpret path, separate Control Plane authorization, or owner-side durable commitment. Those are implementation gaps described in [behavior.md](behavior.md), not accepted decisions.
