# Runtime and Measurement Boundary

- Path: `ctx/docs/environment/runtime.md`
- Changed: `20260717`

## Purpose

Defines the small deterministic runtime boundary of the current reconnaissance slice and the evidence required before asserting production latency policy.

## Current Deterministic Runtime

Node.js 20 or later runs the tests and probe. `npm test` uses Node's built-in test runner. `npm run probe -- <scenario>` reads a supplied deterministic JSON scenario and writes JSON to standard output.

Normal verification requires no network, provider account, credential, HTTP listener, database, or persistent filesystem state beyond reading the scenario. The scripted model client and in-memory adapters make the slice reproducible without paid APIs.

## Authorized Live Provider Reconnaissance

The opt-in `npm run probe:openai -- scenarios/openai-smoke.json` probe invokes an OpenAI adapter with a provider credential supplied outside the repository. It may send only public Principal data: data that is not confidential. One execution across all package scenarios must be capped at an aggregate provider cost of USD 0.10. This mode is for discovering the main design directions during functional reconnaissance, not for exhaustive functional verification.

Live-provider credentials, request bodies containing Principal data, and secret values must not enter repository files, deterministic fixtures, or ordinary test and probe output. The normal deterministic verification boundary remains unchanged.

The initial live probe uses one synthetic public scenario and Primary interpretation only. It has a bounded serialized context and output-token limit, calculates a conservative preflight maximum cost before making a request, and reports actual token usage and estimated cost after a response. A Gate escalation does not trigger a Deep provider request in this mode.

`ALARISA_CONTROL_PROVIDER_API_KEY` and `ALARISA_CONTROL_SMOKE_MODEL` are supplied to the probe process by its caller. The composition root transfers them into an immutable DI configuration component; source adapters never access runtime environment or environment files.

## Target Operational Constraints

Message Interpretation normally participates in synchronous human interaction. The normal path should favour compact context, short structured output, bounded timeouts, appropriate prompt caching, and provider-session reuse where useful. Escalation should occur only when justified by interpretation policy. When provisional current-session interpretation semantically detects `start_new`, the required clean-context re-interpretation is an accepted quality cost rather than an avoidable retry.

Do not infer fixed production latency or cost budgets from the current tests. Before policy is tightened, functional reconnaissance must measure Primary latency, clean-context re-interpretation latency, escalated latency, model and token cost, context size, escalation rate, malformed-output rate, clarification rate, and quality on known scenarios.

## Boundary

Provider credentials, provider accounts, production HTTP hosting, authentication policy, durable storage, and deployment topology belong to their respective owners. A future provider adapter must not turn provider-session state into logical-session truth or enter deterministic verification.
