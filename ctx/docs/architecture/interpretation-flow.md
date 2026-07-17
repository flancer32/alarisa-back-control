# Interpretation Flow

1. Receive an Accepted Principal Message from ingress; the Message Interpreter does not accept or authenticate raw HTTP payloads.
2. Reject the canonical message without `id`, non-empty `content`, or `createdAt`.
3. Read current logical session and supplied Principal data concurrently.
4. Continue a session for `replyTo`, otherwise only within the configured session gap; start a new session in all other cases.
5. Assemble context from supplied representation, state, Cases, selected-session history, trigger, and current message.
6. Call Primary with the configured timeout, parse JSON text when supplied, and validate the proposal shape.
7. Accept only a valid Primary proposal with the expected session action, no ambiguities, known Case identifiers, no representation contradiction, no significant consequence, and no request for more context. A `clarify` next move remains a clarification result.
8. Escalate every other Primary result to Deep. A valid Deep proposal is selected; `clarify` remains a clarification result. An invalid Deep result fails.
9. Enrich a valid selected proposal with path and latency, then save the next logical session.

The gate does not authorize semantic changes or Signal candidates. It only selects a provisional proposal.
