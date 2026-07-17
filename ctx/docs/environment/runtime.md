# Runtime and Measurement Boundary

- Path: `ctx/docs/environment/runtime.md`
- Changed: `20260717`

## Purpose

Defines the small deterministic runtime boundary of the current reconnaissance slice and the evidence required before asserting production latency policy.

## Current Deterministic Runtime

Node.js 20 or later runs the tests and probe. `npm test` uses Node's built-in test runner. `npm run probe -- <scenario>` reads a supplied deterministic JSON scenario and writes JSON to standard output.

Normal verification requires no network, provider account, credential, HTTP listener, database, or persistent filesystem state beyond reading the scenario. The scripted model client and in-memory adapters make the slice reproducible without paid APIs.

## Target Operational Constraints

Message Interpretation normally participates in synchronous human interaction. The normal path should favour compact context, short structured output, bounded timeouts, appropriate prompt caching, and provider-session reuse where useful. Escalation should occur only when justified by interpretation policy.

Do not infer fixed production latency or cost budgets from the current tests. Before policy is tightened, functional reconnaissance must measure Primary latency, escalated latency, model and token cost, context size, escalation rate, malformed-output rate, clarification rate, and quality on known scenarios.

## Boundary

Provider credentials, provider accounts, production HTTP hosting, authentication policy, durable storage, and deployment topology belong to their respective owners. A future provider adapter must not turn provider-session state into logical-session truth or enter deterministic verification.
