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

## Current Coverage

The deterministic suite covers a continued current session, replacement after the implemented gap shortcut, reply-linked continuation in the current shortcut, Primary acceptance, ambiguity and other escalation conditions, selected Deep output, clarification, timeout failure, proposal enum validation, multiple Cases within a session, and deterministic probe output.

This coverage validates the current slice only. It does not prove target semantic session selection, relevance-based state retrieval, strict missing-field handling, provider recovery, Primary/Deep arbitration, accepted ingress, durable state, or Control Plane authority application. Those remain implementation work described at the architecture level.
