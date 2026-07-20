# Interpretation Session State

- Path: `ctx/docs/architecture/state.md`
- Changed: `20260717`

## Purpose

Defines Control Plane semantic ownership of the logical Interpretation Session, distinguishes it from physical persistence and optional provider state, and records the target lifecycle.

## Semantic Ownership

The Control Plane owns the meaning of the one current logical Interpretation Session for the Principal–Representative interaction. This semantic ownership includes its lifecycle, `continue | start_new` decision, current conversational frame, transition invariants, recovery rules, and the interpretation of all stored session fields. It is an accepted architecture decision, not an open question.

No Case, provider, or storage implementation owns session semantics. A Case may participate in a session but never creates a separate current session. A Provider LLM Session is metadata beneath the logical session, never its authority.

## Logical Interpretation Session

The logical session is the authoritative and reconstructable continuity concept defined by the Control Plane. Its record may contain a session identity, current conversational frame, bounded connected-Message history, unresolved references and temporary alternatives, pending questions, expected next move, relevant Case relations, and non-authoritative provider metadata.

The session may involve zero, one, or many Cases; a Case may recur in many sessions over time. The local frame supports continuation only. A clean new-session interpretation instead starts from a relevant Principal Representation projection, including relevant Principal Model and Principal State projections, together with the current Message and relevant trigger or durable references.

## Physical Persistence Boundary

The physical durable-storage placement is intentionally open. `alarisa-back-state`, another infrastructure store, or an adapter injected into `alarisa-back-control` may retain the session record. The Session Manager controls the port's semantic contract and lifecycle policy; persistence merely records or restores that data.

The storage placement is the only unresolved ownership question here. It must support reconstruction without a provider session and must not replace the one logical-session model with provider-specific identities or simultaneous active session records.

## Lifecycle and Context Transition

- On `continue`, retain and update the current frame's useful local meaning after the final proposal passes interpretation policy and the Control Plane authorizes the transition.
- On deterministic pre-session evidence for `start_new`, create a clean candidate frame for context construction before Primary; do not include the prior local history.
- On a `start_new` proposal produced from provisional current-session context, do not replace the current record or accept its semantic meaning. Rebuild a clean context and reinterpret the Message before Gate evaluation.
- On an accepted new-session outcome, replace the current frame while preserving relevant durable continuity through Principal Representation and explicitly referenced durable information.
- When provider state is unavailable, reconstruct logical continuity without it.
- Do not infer a new session solely from a Case, reply link, or elapsed time, and do not model simultaneous active logical sessions.

## Provider LLM Session

A Provider LLM Session may be a conversation identifier, response chain, cache, or persistent provider API session. It can improve latency for dense connected communication, but may expire, be lost, grow too large, be replaced with another model, or be recreated after recovery. Its lifetime does not determine semantic session lifetime and it must never be the sole source of truth.

A provider session may be renewed for a new logical session, provider limitation, context growth, expiry, model replacement, or recovery. Reuse is an optimisation subject to measurement, not a product invariant.

## Current Exploratory State

The current in-memory adapter stores one process-local value only. The `Plane` writes an identifier, timestamps, local Message snippets, pending questions, expected next move, and Case identifiers after a valid selected proposal. It has no durable reconstruction, Control Plane semantic session manager, candidate transition lifecycle, provider metadata, or provider adapter. This demonstrates the single-current-value shape, not the target state design.
