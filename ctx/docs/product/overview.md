# Control Plane Interpretation Reconnaissance

## Current Truth

This private package is a functional reconnaissance of the server-side Alarisa Control Plane Message Interpretation slice. Given one Principal Message and supplied Principal representation, state, Cases, and optional logical interpretation session, it returns a Semantic Interpretation Proposal.

## Outcome

The proposal records a provisional reading of meaning, communicative intent, referenced entities, affected Cases, possible semantic changes and Signal candidates, ambiguities, next move, confidence evidence, and processing metadata. It is not domain truth and cannot by itself change Principal representation, Cases, Tasks, Intent, or Signals.

## Boundaries

The package uses a low-latency Primary interpretation first and may use a Deep interpretation after deterministic quality checks. A logical session is package-owned context; it is not a provider conversation session.

This package must not expose HTTP, authenticate, persist production data, execute agents or tasks, commit Signals, or acquire task-orchestration responsibility. Provider adapters and credentials are outside the deterministic probe.

## Authority

The parent project context at `../../../../alarisa/ctx/docs/` defines Alarisa-wide product meaning. This document narrows only the accepted responsibility of `@flancer32/alarisa-back-control`.
