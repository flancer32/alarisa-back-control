# Interpretation Session State

- Path: `ctx/docs/architecture/state.md`
- Changed: `20260717`

## Purpose

Defines the authoritative logical-session model and distinguishes it from optional provider LLM session state.

## Logical Interpretation Session

Alarisa owns exactly one current logical Interpretation Session for the Principal–Representative interaction. It is authoritative for conversational continuity and reconstructable from package-controlled data. It may hold a session identity, current conversational frame, bounded connected-Message history, unresolved references and temporary alternatives, pending questions, expected next move, relevant Case relations, and non-authoritative provider metadata.

The session does not belong to a Case. It may involve zero, one, or many Cases, and a Case may recur in many sessions over time. The exact durable owner of session state is part of the target state boundary; this package must not silently claim durable storage ownership.

## Lifecycle

- On `continue`, preserve and update the current frame and its useful local meaning.
- On `start_new`, replace the current frame while rebuilding context from relevant Principal Representation, Principal State, trigger context, and the current Message.
- When provider state is unavailable, reconstruct logical continuity without it.
- Do not model simultaneous active logical sessions or infer a new one solely from a Case, reply link, or elapsed time.

## Provider LLM Session

A Provider LLM Session may be a conversation identifier, response chain, cache, or persistent provider API session. It can improve latency for dense connected communication, but may expire, be lost, grow too large, be replaced with another model, or be recreated after recovery. Its lifetime does not determine semantic session lifetime and it must never be the sole source of truth.

A provider session may be renewed for a new logical session, provider limitation, context growth, expiry, model replacement, or recovery. Reuse is an optimisation subject to measurement, not a product invariant.

## Current Exploratory State

The current in-memory adapter stores one process-local value only. The `Plane` writes an identifier, timestamps, local Message snippets, pending questions, expected next move, and Case identifiers after a valid selected proposal. It has no durable reconstruction, conversational-frame model, provider metadata, or provider adapter. This demonstrates the single-current-value shape, not the target state design.
