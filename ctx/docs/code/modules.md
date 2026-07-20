# Source Module Mapping

- Path: `ctx/docs/code/modules.md`
- Changed: `20260717`

## Purpose

Maps the present reconnaissance implementation to the target Message Interpretation architecture without claiming that the target component split already exists.

## Source Boundary

`package.json` maps the `Alarisa_Back_Control_` namespace prefix to `src/`. Source modules begin with `// @ts-check`, publish namespace and description JSDoc, use constructor closures for container-managed behaviour, and declare dependencies through frozen `__deps__` descriptors. Source modules do not statically import one another, perform top-level work, or look up the container manually.

## Current Modules

- `src/Plane.mjs` — one exploratory component that currently combines coordination, session shortcut policy, context construction, model invocation, embedded Gate logic, and provisional result selection.
- `src/Proposal.mjs` — partial proposal normalizer and validator for the deterministic slice.
- `src/Adapter/InMemoryPrincipalRepresentationReader.mjs` — process-local reader returning all supplied data rather than a relevance projection.
- `src/Adapter/InMemoryInterpretationSessionStore.mjs` — process-local store for one current session value.
- `src/Adapter/ScriptedModelClient.mjs` — deterministic Primary or Deep response source for probes and tests.
- `src/Config/OpenAiSmoke.mjs` — immutable DI runtime configuration for the bounded live OpenAI smoke path.
- `src/Adapter/OpenAIResponsesModelClient.mjs` — Primary-only OpenAI Responses adapter using strict proposal structured output and safe provider diagnostics.

`bin/probe.mjs` and `test/Bootstrap.mjs` own Node.js composition and TeqFW namespace discovery. They may use Node imports because they are composition boundaries rather than source components.

## Alignment With Target

The target Coordinator, Session Manager, Context Builder, Primary Interpreter, Gate, Deep Interpreter, and Normalizer / Validator are documented in [architecture/structure.md](../architecture/structure.md). They are not separate current source modules.

The current reader ignores request relevance and returns all supplied data. The current session store is not durable. The current `Plane` pre-selects continuity with reply/time shortcuts and does not implement semantic `start_new` rebuild-and-reinterpret behaviour. The current Gate is embedded. The current Deep path does not compare or arbitrate against Primary. The OpenAI adapter is a bounded synthetic-data smoke probe, not a production provider integration: it supports only Primary and never provides provider-session reuse. No source module accepts transport input, owns Principal Representation, commits a Signal, mutates Activity or Cases, or runs execution work. These are intentional documentation-visible gaps, not implementation claims.
