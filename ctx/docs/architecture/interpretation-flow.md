# Interpretation Flow

1. Reject a message without `id`, non-empty `content`, or `createdAt`.
2. Read current logical session and supplied Principal data concurrently.
3. Continue a session for `replyTo`, otherwise only within the configured session gap; start a new session in all other cases.
4. Assemble context from supplied representation, state, Cases, selected-session history, trigger, and current message.
5. Call Primary with the configured timeout, parse JSON text when supplied, and validate the proposal shape.
6. Accept only a valid Primary proposal with the expected session action, no ambiguities, known Case identifiers, no representation contradiction, no significant consequence, and no request for more context. A `clarify` next move remains a clarification result.
7. Escalate every other Primary result to Deep. A valid Deep proposal is selected; `clarify` remains a clarification result. An invalid Deep result fails.
8. Enrich a valid selected proposal with path and latency, then save the next logical session.

The gate does not authorize semantic changes or Signal candidates. It only selects a provisional proposal.
