# Interpretation Vocabulary

## Terms

- **Principal Message** — an input message supplied to the interpretation slice.
- **Principal Representation** — supplied current representation against which the proposal is checked; this package does not mutate it.
- **Case** — a supplied parent-project work object that a proposal may reference by known identifier.
- **Logical interpretation session** — package-owned recent-message context selected by reply linkage or time gap.
- **Semantic Interpretation Proposal** — validated provisional interpretation; never authoritative domain state.
- **Primary / Deep** — model-client modes for low-latency interpretation and escalation respectively.
- **Gate** — deterministic decision over a validated Primary proposal: accept, clarify, or escalate.

`Signal candidate` means a proposal field only. It is not a committed Signal or permission to commit one.
