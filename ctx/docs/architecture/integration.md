# Control Plane Integration Boundaries

- Path: `ctx/docs/architecture/integration.md`
- Changed: `20260717`

## Purpose

Defines the boundaries that provide input to or receive output from the Control Plane without assigning their semantic or durable-state ownership to this package by accident.

## Accepted Message Ingress

Message Interpretation begins only after ingress has accepted a Principal Message. Acceptance and its transport, authentication, provenance, idempotency, and durable-receipt facts belong to the appropriate communication, backend, and host composition boundaries. The interpreter receives an accepted Message plus relevant metadata; it does not receive or authenticate a raw network payload.

## Package and Storage Boundaries

| Boundary | Owns | Control-package relation |
| --- | --- | --- |
| `alarisa-comm-*` | shared message contracts and transport adapters | supplies shared communication semantics; does not own interpretation policy |
| `alarisa-back-state` | Principal Representation and durable state assigned to it | supplies relevant Principal Representation projections and commits its authorized changes |
| Session persistence adapter | physical retention and restoration of logical-session records | implements a Control Plane-defined storage port; does not own session lifecycle or truth |
| model clients | provider-specific invocation and optional Provider LLM Session mechanics | adapt behind provider-neutral interpreter contracts |
| wider Control Plane | proposal validation, semantic-effect authorization, clarification, and next control decision | consumes the provisional proposal and coordinates authorized commitment; no model result bypasses it |
| `alarisa-back-exec` | agent, worker, tool, and execution work | receives only later, bounded work prepared by control decisions |
| `@flancer32/alarisa` | host composition, global routes, listener and runtime | composes package-owned handlers or adapters; currently uses the built-in `@flancer32/teq-web` Node.js `http`/`http2` server and request pipeline; is not owned by this package |

Physical session persistence may use `alarisa-back-state`, another infrastructure store, or an injected adapter. This placement remains undecided; it does not affect the Control Plane's semantic ownership of the Interpretation Session.

## Provider Reconnaissance Boundary

OpenAI may be the first real provider adapter used during functional reconnaissance. It receives only a prepared Interpretation Context through the provider-neutral model-client contract and returns provider output or diagnostics for normalization. It does not receive raw transport payloads, own session semantics, authorize effects, or commit state.

Live reconnaissance may send only public Principal data: data that is not confidential. The aggregate provider cost for one run of all package scenarios must not exceed USD 0.10. These bounded probes explore the main design directions; they are not exhaustive functional verification.

The initial adapter implements `complete({context, mode})` and invokes the OpenAI Responses API with a strict JSON Schema for the common Semantic Interpretation Proposal. The common proposal service owns that schema and remains the local structural validator. Provider response identifiers, model name, token usage, and request identifiers are diagnostics only; they are not logical-session truth or semantic meaning.

The OpenAI adapter receives an immutable DI configuration containing the model, credential, base URL, output limit, and cost policy. A composition root maps externally supplied runtime values into that configuration before adapter resolution. The adapter never reads process environment or an environment file itself.

## Host Transport Reference

The host's current web transport is documented by the installed dependency at `node_modules/@flancer32/teq-web/ai`. Read its `AGENTS.md`, `overview.md`, and `abstractions.md` for the supported TeqFW server and pipeline interface. This reference records the host transport used for integration orientation only; its runtime configuration, listener lifecycle, routes, and trust policy remain owned by `@flancer32/alarisa`.

## Authorization and Commitment Route

```text
Message Interpreter → Semantic Interpretation Proposal
Control Plane → validates proposal and authorizes permitted semantic effects
Control Plane → coordinates authoritative domain command or change request
Owning state component → commits durable change
```

The route distinguishes accepting a candidate Signal from constructing an authoritative change request and from physically committing the data. The Control Plane may orchestrate updates to Principal Representation, including its Principal State, Activity, Cases, accepted decisions, and Signals, but each affected durable structure is committed through its owner. A schema-valid model response cannot skip this route.

## Integration Rules

- Provider adapters do not own durable Principal Representation or any part of it, session semantics, or authority.
- Reader interfaces expose only the relevance projection required for an interpretation attempt.
- A session-storage port must allow logical-session reconstruction without provider metadata and must remain subordinate to Session Manager policy.
- A future inbound adapter may be package-owned, but global route allocation, listener startup, and trust policy remain outside this package.
- Downstream execution outcomes return as information for later Control Plane decisions; they do not directly mutate interpretation or state.
- Current source code has no accepted-ingress, production model, session-persistence, state-owner command, execution, or host adapter. Those integrations remain explicitly unimplemented.
