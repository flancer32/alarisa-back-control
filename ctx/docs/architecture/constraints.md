# Control Plane Constraints

- Path: `ctx/docs/architecture/constraints.md`
- Changed: `20260717`

## Purpose

Records architectural invariants that constrain target design and prevent exploratory shortcuts from becoming product claims.

## Constraints

- One Alarisa instance serves one Principal and one Representative.
- Exactly one current logical Interpretation Session exists.
- A session may involve multiple Cases; no Case owns or creates a separate current session.
- Session outcomes are only `continue` or `start_new`; their decision is semantic and contextual.
- A new session begins from relevant Principal Representation and State, trigger context, and current Message, not from a previous-session summary as its primary foundation.
- Principal Representation is durable state owned outside model adapters; Interpretation Context is temporary and bounded.
- A model response cannot directly commit Signals, mutate Principal Representation, Cases, or Activity, or authorize execution.
- Provider LLM sessions are optional optimisations and never authoritative continuity state.
- The core remains provider-neutral; provider-specific concerns stay behind adapters.
- The normal interaction path is synchronous and latency-sensitive, but no fixed production budget is asserted without measurement.
- Deterministic tests and probes must run without paid provider APIs.
- Accepted decisions, current implementation facts, hypotheses, and open research questions must remain explicitly distinct.
