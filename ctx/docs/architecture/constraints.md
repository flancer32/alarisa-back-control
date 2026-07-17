# Control Plane Constraints

- Path: `ctx/docs/architecture/constraints.md`
- Changed: `20260717`

## Purpose

Records architectural invariants that constrain target design and prevent exploratory shortcuts from becoming product claims.

## Constraints

- One Alarisa instance serves one Principal and one Representative.
- Exactly one current logical Interpretation Session exists. The Control Plane semantically owns its lifecycle, local frame, `continue | start_new` decision, and transition rules.
- A session may involve multiple Cases; no Case owns or creates a separate current session.
- Session persistence may be delegated to `alarisa-back-state`, another store, or an injected adapter, but physical storage does not own session semantics.
- Strong deterministic control evidence may pre-determine `start_new`; elapsed time alone never does.
- Without decisive evidence, a `start_new` result from current-session context is a request to rebuild clean context and reinterpret the Message, not a final semantic interpretation.
- A rebuilt new-session context excludes prior local conversational history. It may include relevant Principal Model and Principal State projections, current Message, trigger context, explicitly referenced durable events, Cases, and decisions.
- Principal Representation contains Principal Model and Principal State. It is durable state owned outside model adapters; Interpretation Context is temporary and bounded.
- A model response cannot directly commit Signals, mutate Principal Representation or any part of it, Cases, or Activity, or authorize execution.
- The Control Plane validates and authorizes semantic effects, then coordinates commitment through the component that owns the affected durable state.
- Provider LLM sessions are optional optimisations and never authoritative continuity state or the sole reconstruction source.
- The core remains provider-neutral; provider-specific concerns stay behind adapters.
- The normal interaction path is synchronous and latency-sensitive. Re-interpretation after semantically detected `start_new` is an accepted quality cost that must be measured, not silently removed.
- Deterministic tests and probes must run without paid provider APIs.
- Accepted decisions, current implementation facts, hypotheses, and open research questions must remain explicitly distinct.
