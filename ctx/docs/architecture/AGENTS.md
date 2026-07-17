# Architecture Documentation

## Purpose

Defines the implementation responsibilities that realize the product-level reconnaissance boundary.

## Level Map

- `overview.md` — component map and dependency direction.
- `interpretation-flow.md` — deterministic processing and escalation rules.

## Level Boundary

Keep model clients, representation readers, and session stores behind supplied component contracts. Do not add HTTP, durable production persistence, authentication, agent execution, or Signal application to this package.
