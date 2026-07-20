# Control Plane Product Overview

- Path: `ctx/docs/product/overview.skin.md`
- Changed: `20260717`

## Purpose

Alarisa serves one Principal through one Representative. Control Plane decides what a received Message may mean and what Alarisa may safely do next.

## Mental Model

Message Interpretation is the slice. It reads an accepted Principal Message in bounded context and returns a Semantic Interpretation Proposal, not a fact or command. State and execution keep ownership; Control Plane authorizes effects and coordinates commitment.

Principal Representation is Alarisa's durable basis: Principal Model holds stable knowledge and Principal State the situation. The Control Plane semantically owns the one current Interpretation Session; an adapter may persist it, while provider LLM sessions only optimize it.

## Scope

Includes:

- The future Control Plane and current Message Interpretation exploration.
- Boundaries with state, execution, and communication.

Excludes:

- Model-authorized Signals or direct mutations.
- Treating exploratory code as the complete production architecture.

## Invariants

- One Principal, one Representative, and one current logical Interpretation Session.
- A Message is evidence; a Signal requires authorization and owner-side commitment.
- A Case and a provider session never define conversational truth.

## Agent Document

`overview.md`
