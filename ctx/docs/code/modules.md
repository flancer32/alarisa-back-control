# Source Modules

`package.json` maps namespace prefix `Alarisa_Back_Control_` to `src/`. A component address maps underscores after that prefix to directories: `Alarisa_Back_Control_Plane$` resolves `src/Plane.mjs` and selects its default export.

Every source module begins with `// @ts-check` and a namespace/description JSDoc block. Container-managed behavior is created in constructor closures. Inter-component dependencies are frozen `__deps__` CDC declarations at the end of the module. Source modules have no static imports, top-level execution, or manual container lookup.

`Proposal.mjs` publishes schema validation. `Plane.mjs` publishes orchestration. `Adapter/*.mjs` publishes deterministic probe adapters. Consumers compose components through the TeqFW namespace.
