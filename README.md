# @flancer32/alarisa-back-control

Functional reconnaissance for Alarisa's server-side Control Plane Message Interpretation slice.

It accepts a Principal Message, reconstructs a logical interpretation context, selects a low-latency Primary or escalated Deep interpretation, applies deterministic quality gates, and returns a validated Semantic Interpretation Proposal. It is **not** production Control Plane functionality: it does not expose HTTP, authenticate, persist production data, execute agents, commit Signals, or mutate Principal Representation.

## Run

```sh
npm install
npm test
npm run probe -- scenarios/continuous-discussion.json
```

The probe consumes a scenario with Principal representation, state, optional Cases/current session, messages, fake Primary/Deep responses, and expected properties. It prints session action, compact assembled context, Primary result, gate decision, Deep usage, final proposal, latency, usage, and errors without credentials.

## Extending

Provide a `ModelClient` implementing `complete({context, mode})`; it must return an object or JSON text compatible with the proposal schema. A real adapter is optional and must keep credentials in environment variables; normal CI uses only deterministic fake clients.

The package uses package-owned logical sessions, not provider conversation sessions. Provider response chaining and prompt caches may be added as adapter optimisations without becoming the source of truth.

See `ctx/docs/` for product constraints, architecture, environment, coding rules, and open questions.
