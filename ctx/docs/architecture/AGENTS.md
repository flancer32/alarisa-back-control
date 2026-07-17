# Architecture Documentation

## Purpose

Defines the implementation responsibilities that realize the product-level Message Interpreter boundary.

## Level Map

- `overview.md` — component map and dependency direction.
- `interpretation-flow.md` — deterministic processing and escalation rules.

## Level Boundary

Keep model clients, representation readers, and session stores behind supplied component contracts. A backend HTTP handler is permitted as an inbound adapter and may be registered by the host pipeline. Do not add global HTTP hosting or route ownership, durable-persistence ownership, authentication policy, agent execution, or Signal application to this package.
