# @flancer32/alarisa-back-control

Server-side Control Plane Message Interpreter module for the Alarisa modular monolith.

It accepts an Accepted Principal Message, reconstructs a logical interpretation context, selects a low-latency Primary or escalated Deep interpretation, applies deterministic quality gates, and returns a validated Semantic Interpretation Proposal. The package may provide a Teq Web inbound handler using the shared `@flancer32/alarisa-comm` contracts; the host application registers it in the request pipeline. It does not own global HTTP hosting, authentication policy, durable persistence, agent execution, Signal commitment, or Principal Representation mutation.

## Run

```sh
npm install
npm test
npm run probe -- scenarios/continuous-discussion.json
```

## Local comm development

When the sibling `alarisa-comm` repository is available, run `npm run dev:link-comm` to replace the installed package with a local symlink. This is a developer-only setup; `npm ci` restores the GitHub revision locked in `package-lock.json` for CI and deployment.

The probe consumes a scenario with Principal representation, state, optional Cases/current session, messages, fake Primary/Deep responses, and expected properties. It prints session action, compact assembled context, Primary result, gate decision, Deep usage, final proposal, latency, usage, and errors without credentials.

## Extending

Provide a `ModelClient` implementing `complete({context, mode})`; it must return an object or JSON text compatible with the proposal schema. A real adapter is optional and must keep credentials in environment variables; normal CI uses only deterministic fake clients.

The package uses package-owned logical sessions, not provider conversation sessions. Provider response chaining and prompt caches may be added as adapter optimisations without becoming the source of truth.

See `ctx/docs/` for product constraints, architecture, environment, coding rules, and open questions.
