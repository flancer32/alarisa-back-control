# Control Plane Message Interpreter

## Current Truth

This private package is the server-side Control Plane Message Interpreter module in the Alarisa modular monolith. Given one accepted Principal Message and supplied Principal representation, state, Cases, and optional logical interpretation session, it returns a Semantic Interpretation Proposal.

## Outcome

The proposal records a provisional reading of meaning, communicative intent, referenced entities, affected Cases, possible semantic changes and Signal candidates, ambiguities, next move, confidence evidence, and processing metadata. It is not domain truth and cannot by itself change Principal representation, Cases, Tasks, Intent, or Signals.

## Boundaries

The package uses a low-latency Primary interpretation first and may use a Deep interpretation after deterministic quality checks. A logical session is package-owned context; it is not a provider conversation session.

The package may provide a TeqFW HTTP pipeline handler for its inbound endpoint. The server composition root registers that handler and owns the global route map and listener. The handler uses shared `@flancer32/alarisa-comm` contracts and delegates acceptance/trust facts to supplied backend ports; it does not own authentication policy.

This package must not own global HTTP hosting or route allocation, durable persistence, authentication policy, agent or task execution, Signal commitment, or task orchestration. Provider adapters and credentials are outside deterministic verification.

## Authority

The parent project's [flancer32/alarisa-ctx](https://github.com/flancer32/alarisa-ctx/) `docs/` context defines Alarisa-wide product meaning and the [package-area mapping](https://github.com/flancer32/alarisa-ctx/blob/main/docs/code/package-areas.md). This document narrows only the accepted responsibility of `@flancer32/alarisa-back-control`.
