# Verification

- Path: `ctx/docs/code/verification.md`
- Changed: `20260717`

## Purpose

Defines deterministic checks for the current exploratory implementation and the context structure.

## Required Checks

Run:

```sh
adsm-ctx validate
teqfw-esm-validator src
npm test
npm run probe -- scenarios/ambiguous-confirmation.json
```

The ADSM validator must report no errors or warnings. The ESM validator must report no violations. Tests and the probe must pass without provider credentials or network access.

## Optional Live Smoke Probe

`npm run probe:openai -- scenarios/openai-smoke.json` is an opt-in manual reconnaissance check. Its caller supplies `ALARISA_CONTROL_PROVIDER_API_KEY` and `ALARISA_CONTROL_SMOKE_MODEL` to the process; the package passes them into immutable DI configuration and never loads an environment file. The scenario contains only synthetic public data. The probe permits one bounded Primary request and reports proposal, Gate result, latency, safe provider diagnostics, token usage, and estimated cost. It is not a normal test, CI check, or exhaustive provider evaluation.

## Current Coverage

The deterministic suite covers a continued current session, replacement after the implemented pre-Primary gap shortcut, reply-linked continuation in the current shortcut, Primary acceptance, ambiguity and other escalation conditions, selected Deep output, clarification, timeout failure, proposal enum validation, multiple Cases within a session, and deterministic probe output.

This coverage validates the current slice only. In addition, offline mocked tests cover OpenAI smoke configuration, strict structured-output request construction, safe provider diagnostics, provider failure, cost/context guards, and TeqFW DI composition. It does not prove target semantic session selection with clean-context re-interpretation, relevance-based state retrieval, provider recovery, Primary/Deep arbitration, accepted ingress, durable state, production provider reliability, or Control Plane authorization and owner-side commitment. Those remain implementation work described at the architecture level.
