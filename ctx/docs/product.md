# Product

## Purpose

`@flancer32/alarisa-back-control` is the future server-side Control Plane package for Alarisa. Its present implementation is functional reconnaissance of the synchronous, latency-sensitive Message Interpretation vertical slice; it is not the full Control Plane.

Alarisa is the single Representative of one Principal. The Principal may have many active Cases. The interpreter helps the Representative understand raw meaningful input quickly enough for a natural Signals interaction, then returns a **Semantic Interpretation Proposal**. It never commits Signals or changes the real Principal Representation.

## Reconnaissance hypothesis

The package validates whether a fast model plus explicit deterministic gate can handle connected short messages, while a deeper path is reserved for ambiguity, missing references, contradiction, or consequence. It remains independently executable: no Alarisa server, browser, database, authentication layer, or provider session is required.

## Invariants

- `Message` is raw meaningful input received from the Principal; do not call it `Contribution`.
- There is one current logical Interpretation Session between Principal and Representative.
- A session may involve multiple Cases; a Case may recur across sessions.
- Each new Message continues that session or starts a new one.
- A new session starts from current Principal Representation and Principal state, never empty context and never chiefly from a prior textual summary.
- Important earlier results must be assimilated into structured representation and Activity state.
- Provider conversations are disposable optimisations, not logical sessions.
