# Interpretation Vocabulary

## Terms

- **Principal Message** — communication from the Principal. Its transport shape is a shared `@flancer32/alarisa-comm` contract.
- **Accepted Principal Message** — a Principal Message for which an ingress port has established the required trust and durable-acceptance facts. This is the Message Interpreter input; it is not a raw HTTP payload.
- **Principal Representation** — supplied current representation against which the proposal is checked; this package does not mutate it.
- **Case** — a supplied parent-project work object that a proposal may reference by known identifier.
- **Logical interpretation session** — package-owned recent-message context selected by reply linkage or time gap.
- **Semantic Interpretation Proposal** — validated provisional interpretation; never authoritative domain state.
- **Primary / Deep** — model-client modes for low-latency interpretation and escalation respectively.
- **Gate** — deterministic decision over a validated Primary proposal: accept, clarify, or escalate.

`Signal candidate` means a proposal field only. It is not a committed Signal or permission to commit one.
