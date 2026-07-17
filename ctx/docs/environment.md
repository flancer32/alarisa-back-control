# Environment

- Runtime: Node.js 20 or newer; native ES modules and native `node:test`.
- Package manager: npm.
- Install: `npm install` (currently no runtime dependencies).
- Test: `npm test`.
- Probe: `npm run probe -- scenarios/continuous-discussion.json`.

Normal tests and all bundled scenarios use deterministic fake `ModelClient` implementations and require neither network nor credentials. `.env.example` documents optional smoke-test variables for a future real-provider adapter; a smoke test must remain excluded from normal CI.

The package has no direct database, HTTP server, UI, authentication, or full-Alarisa dependency. Probe output intentionally reports selected fields and metadata, not full Principal data or credentials.
