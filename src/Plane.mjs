// @ts-check

/**
 * @namespace Alarisa_Back_Control_Plane
 * @description Assembles context, selects interpretation depth, and returns a provisional proposal.
 */

// Private parsing helper.
/**
 * Parses a model response that may be supplied as JSON text.
 * @param {unknown} raw Model response.
 * @returns {object} Parsed proposal candidate or parse error.
 */
function parseModelResult(raw) {
  if (typeof raw === "string") { try { return JSON.parse(raw); } catch { return {error: "invalid JSON"}; } }
  return raw;
}

export default class Plane {
  /**
   * @param {object} deps
   * @param {Alarisa_Back_Control_Proposal$} deps.proposal Proposal-schema service.
   */
  constructor({proposal}) {
    /**
     * Selects whether the current message continues the logical session.
     * @param {object|null} current Current logical session.
     * @param {object} message Principal Message.
     * @param {{now(): Date}} clock Time source.
     * @param {number} gapMs Maximum continuation gap.
     * @returns {string} `continue` or `start_new`.
     */
    function decideSession(current, message, clock, gapMs) {
      if (!current) return "start_new";
      if (message.replyTo) return "continue";
      const last = current.lastMessageAt && new Date(current.lastMessageAt).getTime();
      return last && clock.now().getTime() - last <= gapMs ? "continue" : "start_new";
    }
    /**
     * Assembles the read-only model context.
     * @param {object} params Context inputs.
     * @returns {object} Model context.
     */
    function buildContext({message, trigger, data, session, sessionAction}) {
      return {
        interpreterInstructions: "Return only a Semantic Interpretation Proposal object. It remains a proposal, not domain truth.",
        principalRepresentation: data.representation,
        principalState: data.state,
        currentInterpretationSession: sessionAction === "continue" ? session : null,
        recentConnectedMessages: sessionAction === "continue" ? (session?.recentMessages ?? []) : [],
        relevantCases: data.cases,
        pendingQuestions: sessionAction === "continue" ? (session?.pendingQuestions ?? []) : [],
        expectedNextMove: sessionAction === "continue" ? session?.expectedNextMove ?? null : null,
        triggerContext: trigger ?? message.trigger ?? null,
        currentMessage: message,
      };
    }
    /**
     * Applies deterministic acceptance and escalation conditions.
     * @param {object} params Gate inputs.
     * @returns {{decision: string, reasons: string[]}} Gate result.
     */
    function gate({validation, context, message, expectedSessionAction}) {
      if (!validation.ok) return {decision: "escalate", reasons: ["schema_invalid", ...validation.errors]};
      const value = validation.value;
      if (value.requiredNextMove === "clarify") return {decision: "clarify", reasons: ["model_requests_clarification"]};
      if (value.ambiguities.length) return {decision: "escalate", reasons: ["unresolved_ambiguity"]};
      if (value.sessionAction !== expectedSessionAction) return {decision: "escalate", reasons: ["unsupported_session_decision"]};
      const known = new Set((context.relevantCases ?? []).map((item) => item.id));
      if (value.affectedCases.some((id) => !known.has(id))) return {decision: "escalate", reasons: ["unresolved_case_reference"]};
      if (value.referencedEntities.some((item) => item?.contradictsRepresentation)) return {decision: "escalate", reasons: ["representation_contradiction"]};
      if (message.significantConsequences || value.signalCandidates.some((item) => item?.consequential)) return {decision: "escalate", reasons: ["significant_consequences"]};
      if (value.processingMetadata?.needsMoreContext) return {decision: "escalate", reasons: ["primary_requests_context"]};
      return {decision: "accept", reasons: ["deterministic_checks_passed"]};
    }
    /**
     * Invokes a model client with an explicit timeout.
     * @param {{complete(request: object): Promise<unknown>}} client Model client.
     * @param {object} context Assembled interpretation context.
     * @param {string} mode Requested interpretation mode.
     * @param {number} timeoutMs Timeout in milliseconds.
     * @returns {Promise<object>} Parsed model result or adapter failure.
     */
    async function safeComplete(client, context, mode, timeoutMs) {
      let timer;
      try {
        const result = await Promise.race([client.complete({context, mode}), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), timeoutMs); })]);
        return parseModelResult(result);
      } catch (error) { return {error: `model_${mode}_failure: ${error.message}`}; }
      finally { clearTimeout(timer); }
    }
    /**
     * Creates an interpretation operation with supplied ports and policy values.
     * @param {object} config Operation configuration.
     * @param {{read(request: object): Promise<object>}} config.principalRepresentationReader Principal-data reader.
     * @param {{getCurrent(): Promise<object|null>, save(session: object): Promise<object>}} config.interpretationSessionStore Logical-session store.
     * @param {{complete(request: object): Promise<unknown>}} config.primaryModelClient Primary model client.
     * @param {{complete(request: object): Promise<unknown>}} [config.deepModelClient] Deep model client.
     * @param {{now(): Date}} [config.clock] Time source.
     * @param {{debug(message: string, data: object): void}} [config.logger] Diagnostic logger.
     * @param {number} [config.sessionGapMs] Maximum continuation gap.
     * @param {number} [config.modelTimeoutMs] Per-model timeout.
     * @returns {{interpretMessage(request: object): Promise<object>}} Interpretation operation.
     */
    this.create = function ({principalRepresentationReader, interpretationSessionStore, primaryModelClient, deepModelClient = primaryModelClient, clock = {now: () => new Date()}, logger = {debug: () => {}}, sessionGapMs = 30 * 60 * 1000, modelTimeoutMs = 10_000} = {}) {
      for (const [name, value] of Object.entries({principalRepresentationReader, interpretationSessionStore, primaryModelClient})) if (!value) throw new Error(`${name} is required`);
      return Object.freeze({
        /**
         * Interprets one Principal Message without changing domain truth.
         * @param {object} [request] Interpretation request.
         * @param {object} request.message Principal Message.
         * @param {object} [request.trigger] Optional trigger context.
         * @returns {Promise<object>} Interpretation result.
         */
        async interpretMessage({message, trigger} = {}) {
          if (!message?.id || !message.content || !message.createdAt) throw new Error("message id, content, and createdAt are required");
          const startedAt = clock.now();
          const [current, data] = await Promise.all([interpretationSessionStore.getCurrent(), principalRepresentationReader.read({message, trigger})]);
          const sessionAction = decideSession(current, message, clock, sessionGapMs);
          const context = buildContext({message, trigger, data, session: current, sessionAction});
          const primaryRaw = await safeComplete(primaryModelClient, context, "primary", modelTimeoutMs);
          const primaryValidation = primaryRaw.error ? {ok: false, errors: [primaryRaw.error]} : proposal.validate(primaryRaw);
          let gateResult = gate({validation: primaryValidation, context, message, expectedSessionAction: sessionAction});
          let finalValidation = primaryValidation;
          let deep = null;
          if (gateResult.decision === "escalate") {
            const deepRaw = await safeComplete(deepModelClient, context, "deep", modelTimeoutMs);
            deep = deepRaw;
            const deepValidation = deepRaw.error ? {ok: false, errors: [deepRaw.error]} : proposal.validate(deepRaw);
            if (deepValidation.ok) { finalValidation = deepValidation; gateResult = {decision: deepValidation.value.requiredNextMove === "clarify" ? "clarify" : "accept", reasons: ["deep_proposal_selected", ...gateResult.reasons]}; }
            else { finalValidation = deepValidation; gateResult = {decision: "fail", reasons: ["deep_validation_failed", ...deepValidation.errors]}; }
          }
          let resultProposal = finalValidation.ok ? finalValidation.value : null;
          if (resultProposal) {
            resultProposal = {...resultProposal, processingMetadata: {...resultProposal.processingMetadata, path: deep ? "deep" : "primary", latencyMs: clock.now().getTime() - startedAt.getTime()}};
            const next = {id: sessionAction === "continue" ? current.id : `session-${message.id}`, startedAt: sessionAction === "continue" ? current.startedAt : clock.now().toISOString(), lastMessageAt: message.createdAt, recentMessages: [...(sessionAction === "continue" ? current.recentMessages ?? [] : []), {id: message.id, content: message.content}], pendingQuestions: [], expectedNextMove: resultProposal.requiredNextMove, caseIds: resultProposal.affectedCases};
            await interpretationSessionStore.save(next);
          }
          logger.debug("message interpreted", {messageId: message.id, decision: gateResult.decision});
          return {sessionAction, context, primary: primaryValidation.ok ? primaryValidation.value : {errors: primaryValidation.errors}, gate: gateResult, deep, proposal: resultProposal, latencyMs: clock.now().getTime() - startedAt.getTime()};
        },
      });
    };
  }
}

export const __deps__ = Object.freeze({proposal: "Alarisa_Back_Control_Proposal$"});
