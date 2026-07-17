# Verification

Run:

```sh
teqfw-esm-validator src
npm test
npm run probe -- scenarios/ambiguous-confirmation.json
```

The validator must report no violations. Tests cover session selection, Primary acceptance, each escalation condition, Deep selection, clarification, timeout failure, schema validation, and deterministic CLI output. Probe scenarios are examples, not production fixtures.
