# Component Structure

## Components

`Alarisa_Back_Control_Plane` coordinates one interpretation. It depends on `Alarisa_Back_Control_Proposal` for schema validation and receives three adapters: a Principal-representation reader, an interpretation-session store, and Primary/Deep model clients.

An inbound backend HTTP handler may adapt a shared `@flancer32/alarisa-comm` request contract to an ingress-acceptance port. After acceptance, it supplies the resulting Accepted Principal Message to `Alarisa_Back_Control_Plane`. The handler is a package-owned adapter; the `@flancer32/alarisa` composition root adds it to the Teq Web pipeline and owns global route allocation.

The deterministic adapters are `Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader`, `Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore`, and `Alarisa_Back_Control_Adapter_ScriptedModelClient`. They exist for probes and tests, not production storage or provider integration.

## Dependency Direction

```text
Control Plane -> Proposal validator
Control Plane -> reader / session store / model-client contracts
Control HTTP handler -> comm contracts -> ingress-acceptance port -> Control Plane
Server composition root -> Teq Web pipeline -> Control HTTP handler
Probe CLI -> TeqFW container -> components
```

Components declare dependencies through TeqFW `__deps__`; source modules do not statically import one another. The CLI owns Node.js imports, namespace discovery, scenario parsing, and composition.

`comm` is the isomorphic boundary shared by browser clients and backend packages. It owns shared message and protocol contracts, not this module's interpretation policy or Control Plane state. The Control package may depend on those contracts but has no dependency on the host composition root.

## State Boundary

Only the supplied session-store adapter receives a next logical session after a valid proposal. The in-memory implementation is process-local. A model provider's session identifier, cache, or response chain cannot become package truth.
