# Control Plane Integration Boundaries

- Path: `ctx/docs/architecture/integration.md`
- Changed: `20260717`

## Purpose

Defines the boundaries that provide input to or receive output from the Control Plane without assigning their ownership to this package.

## Accepted Message Ingress

Message Interpretation begins only after ingress has accepted a Principal Message. Acceptance and its transport, authentication, provenance, idempotency, and durable-receipt facts belong to the appropriate communication, backend, and host composition boundaries. The interpreter receives an accepted Message plus relevant metadata; it does not receive or authenticate a raw network payload.

## Package Boundaries

| Boundary | Owns | Control-package relation |
| --- | --- | --- |
| `alarisa-comm-*` | shared message contracts and transport adapters | supplies shared communication semantics; does not own interpretation policy |
| `alarisa-back-state` | Principal Representation and durable state | supplies explicit relevant projections through reader interfaces |
| model clients | provider-specific invocation and optional provider-session mechanics | adapt behind provider-neutral interpreter contracts |
| wider Control Plane | final validation, authoritative application, clarification, and next control decision | consumes a provisional proposal; no model result bypasses it |
| `alarisa-back-exec` | agent, worker, tool, and execution work | receives only later, bounded work prepared by control decisions |
| `@flancer32/alarisa` | host composition, global routes, listener and runtime | composes package-owned handlers or adapters; is not owned by this package |

## Integration Rules

- Provider adapters do not own durable Principal state or authority.
- Reader interfaces expose only the relevance projection required for an interpretation attempt.
- A future inbound adapter may be package-owned, but global route allocation, listener startup, and trust policy remain outside this package.
- Downstream execution outcomes return as information for later Control Plane decisions; they do not directly mutate interpretation or state.
- Current source code has no accepted-ingress, production model, state, execution, or host adapter. Those integrations remain explicitly unimplemented.
