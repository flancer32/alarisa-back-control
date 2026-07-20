# Control Plane Glossary

- Path: `ctx/docs/product/glossary.md`
- Changed: `20260717`

## Purpose

Defines canonical product vocabulary for this package. Use these meanings consistently in all lower documentation.

## Core Terms

- **Principal** — the single human served by one Alarisa instance.
- **Representative** — Alarisa, the single digital representative of that Principal.
- **Message** — meaningful input communicated by the Principal. `Message` is the only accepted product term for this input.
- **Accepted Principal Message** — a Message whose required ingress and durable-acceptance facts were established before this package receives it. Acceptance is not semantic authority.
- **Principal Representation** — structured information that lets Alarisa represent this Principal. It contains Principal Model and Principal State.
- **Principal Model** — relatively stable information such as durable goals, preferences, constraints, decision patterns, terminology, and working style.
- **Principal State** — dynamic information such as current activity, active Cases, decisions, priorities, open questions, and next-move ownership. It is a part of Principal Representation, not its peer.
- **Case** — a Principal attention and activity object. It can participate in many Interpretation Sessions over time.
- **Interpretation Session** — the one current, logical Principal–Representative communication frame. The Control Plane semantically owns its meaning, lifecycle, `continue | start_new` decision, local frame, and transition rules. It may involve zero, one, or many Cases.
- **Logical Interpretation Session** — the Control Plane-defined and reconstructable form of an Interpretation Session; this is the authoritative continuity concept.
- **Session Persistence Adapter** — a physical store selected or injected to retain a logical-session record. It does not own session semantics merely by storing it.
- **Provider LLM Session** — an optional provider conversation ID, response chain, cache, or persistent API session. It is a technical optimisation, never the source of session truth.
- **Interpretation Context** — a bounded temporary context prepared for one model interpretation; it is not the full Principal Representation.
- **Semantic Interpretation Proposal** — a provisional structured result of Message Interpretation. It may recommend a session outcome, meaning, semantic changes, candidate Signals, clarification, or another next move.
- **Signal** — an authoritative semantic exchange between Principal and Alarisa. A raw Message and a candidate Signal are not Signals.
- **Control Plane** — the server-side responsibility area that controls Alarisa's cognitive and operational next move. It validates proposals, authorizes semantic effects, governs Interpretation Session semantics, and coordinates commitment through the components that own affected durable state.
- **Message Interpretation** — the Control Plane subsystem that prepares context and produces a Semantic Interpretation Proposal for an accepted Message.
- **Primary Message Interpreter** — the default low-latency, model-assisted interpretation path.
- **Interpretation Gate** — the policy decision that assesses whether a proposal is sufficient to accept, clarify, escalate, or fail. It is not a Signal-commit authority.
- **Deep Message Interpreter** — the escalation path for difficult or consequential interpretation, with potentially stronger models, more context, or more time.

## Terminology Rules

- Use `Message` in product and architecture meaning. Legacy alternative naming is prohibited in this corpus.
- Use `Principal Representation` for the object containing Principal Model and Principal State; describe context input as relevant Principal Model and Principal State projections or a relevant Principal Representation projection.
- Use `Semantic Interpretation Proposal` for the interpreter output and `Signal` only for an accepted authoritative semantic exchange.
- Use `Interpretation Session` for the logical Principal–Representative frame; qualify provider state as `Provider LLM Session`.
- Use `continue` and `start_new` only for the two session-level outcomes.

## Terminology Invariants

- A provider session, Session Persistence Adapter, Case, or raw Message cannot be renamed or treated as the logical Interpretation Session.
- A proposal never becomes a Signal merely because it is syntactically valid.
- Terms in this glossary define product meaning; source identifiers and transport fields do not replace them.
