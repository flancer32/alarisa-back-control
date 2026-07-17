# Architecture

## Flow

`InterpretationCoordinator` exposes `interpretMessage({message, trigger})`. It asks `InterpretationSessionManager` for the only current logical session, builds a provider-neutral structured context, calls `PrimaryMessageInterpreter`, applies `InterpretationGate`, optionally calls `DeepMessageInterpreter`, and normalises the final proposal.

The context builder reads external state through explicit `PrincipalRepresentationReader` and `InterpretationSessionStore` contracts. It does not own the whole Principal Representation. The provided in-memory adapters are only reconnaissance fixtures.

## Components

- **Interpretation Coordinator** — package use case and final policy.
- **Session Manager** — one current logical session and deterministic provisional continuity decision.
- **Context Builder** — constructs structured, minimal relevant input.
- **Primary Interpreter** — low-latency structured model request.
- **Interpretation Gate** — deterministic acceptance, escalation, clarification, or failure decision; it never trusts numeric model confidence alone.
- **Deep Interpreter** — independent stronger/extended path behind the same model contract.
- **Result Normalizer** — validates provider output into one stable proposal shape.

Primary and Deep adapters use `ModelClient.complete({context, mode})`; provider-specific sessions may be attached to the adapter but are absent from package-owned logical state. Losing one therefore cannot lose or redefine the Interpretation Session.

## Final policy

An accepted Primary proposal is final. On escalation, a valid Deep proposal is final. A Deep failure retains the explicit gate result and no invented proposal. `clarify` is surfaced to a caller; this package does not send the clarification.

## Findings and open questions

- The minimum new-session bridge currently appears to be structured Principal Representation, state, relevant Cases, and trigger context; no session prose is needed.
- Continuity is provisionally determined before Primary interpretation from reply linkage and time gap, but the Gate can reject unsupported session decisions. Whether the model should influence this earlier remains open.
- The useful session lifetime, context size limits, and real latency/cost thresholds need production-like measurement with redacted data.
- Gate evidence is currently schema, ambiguity, entity resolution, contradiction, consequence, and explicit-more-context checks. Its false-positive/negative rate is unmeasured.
- Deep interpretation is likely valuable for incomplete context, not for every low-confidence reply. Clarification is safer than more depth when an essential target remains absent.
- Proposal schema stability and future extraction boundaries remain hypotheses; no subpackage is justified yet.
