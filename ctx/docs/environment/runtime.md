# Runtime Boundary

Node.js 20 or later runs the probe and tests. `npm test` uses the built-in Node test runner. `npm run probe -- <scenario>` reads only a supplied deterministic JSON scenario and writes JSON results to standard output.

Normal verification has no network, credentials, HTTP listener, database, or filesystem persistence beyond reading the scenario. A future real model-client adapter may read provider credentials from environment variables, but it must remain outside deterministic CI and must not make provider session state authoritative.
