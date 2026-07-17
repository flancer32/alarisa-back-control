# Component Structure

## Components

`Alarisa_Back_Control_Plane` coordinates one interpretation. It depends on `Alarisa_Back_Control_Proposal` for schema validation and receives three adapters: a Principal-representation reader, an interpretation-session store, and Primary/Deep model clients.

The deterministic adapters are `Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader`, `Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore`, and `Alarisa_Back_Control_Adapter_ScriptedModelClient`. They exist for probes and tests, not production storage or provider integration.

## Dependency Direction

```text
Control Plane -> Proposal validator
Control Plane -> reader / session store / model-client contracts
Probe CLI -> TeqFW container -> components
```

Components declare dependencies through TeqFW `__deps__`; source modules do not statically import one another. The CLI owns Node.js imports, namespace discovery, scenario parsing, and composition.

## State Boundary

Only the supplied session-store adapter receives a next logical session after a valid proposal. The in-memory implementation is process-local. A model provider's session identifier, cache, or response chain cannot become package truth.
