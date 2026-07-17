import {validateProposal} from "./proposal.mjs";

const defaultClock = {now: () => new Date()};
const silentLogger = {debug: () => {}, warn: () => {}};

export class InMemoryPrincipalRepresentationReader {
  constructor({representation = {}, state = {}, cases = []} = {}) { this.representation = representation; this.state = state; this.cases = cases; }
  async read() { return {representation: this.representation, state: this.state, cases: this.cases}; }
}
export class InMemoryInterpretationSessionStore {
  constructor(current = null) { this.current = current; }
  async getCurrent() { return this.current; }
  async save(session) { this.current = session; return session; }
}
export class ScriptedModelClient {
  constructor(responses = {}) { this.responses = responses; this.calls = []; }
  async complete({context, mode}) {
    this.calls.push({messageId: context.currentMessage.id, mode});
    const value = this.responses[`${mode}:${context.currentMessage.id}`] ?? this.responses[mode] ?? this.responses[context.currentMessage.id];
    if (value instanceof Error) throw value;
    if (value === undefined) throw new Error(`No scripted ${mode} response for ${context.currentMessage.id}`);
    return typeof value === "function" ? value({context, mode}) : value;
  }
}

function parseModelResult(raw) {
  if (typeof raw === "string") { try { return JSON.parse(raw); } catch { return {error: "invalid JSON"}; } }
  return raw;
}
function decideSession(current, message, clock, gapMs) {
  if (!current) return "start_new";
  if (message.replyTo) return "continue";
  const last = current.lastMessageAt && new Date(current.lastMessageAt).getTime();
  return last && clock.now().getTime() - last <= gapMs ? "continue" : "start_new";
}
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
    currentMessage: message
  };
}
function gate({validation, context, message, expectedSessionAction}) {
  if (!validation.ok) return {decision: "escalate", reasons: ["schema_invalid", ...validation.errors]};
  const p = validation.value;
  if (p.requiredNextMove === "clarify") return {decision: "clarify", reasons: ["model_requests_clarification"]};
  if (p.ambiguities.length) return {decision: "escalate", reasons: ["unresolved_ambiguity"]};
  if (p.sessionAction !== expectedSessionAction) return {decision: "escalate", reasons: ["unsupported_session_decision"]};
  const known = new Set((context.relevantCases ?? []).map(x => x.id));
  if (p.affectedCases.some(id => !known.has(id))) return {decision: "escalate", reasons: ["unresolved_case_reference"]};
  if (p.referencedEntities.some(x => x?.contradictsRepresentation)) return {decision: "escalate", reasons: ["representation_contradiction"]};
  if (message.significantConsequences || p.signalCandidates.some(x => x?.consequential)) return {decision: "escalate", reasons: ["significant_consequences"]};
  if (p.processingMetadata?.needsMoreContext) return {decision: "escalate", reasons: ["primary_requests_context"]};
  return {decision: "accept", reasons: ["deterministic_checks_passed"]};
}

export function createControlPlane({principalRepresentationReader, interpretationSessionStore, primaryModelClient, deepModelClient = primaryModelClient, clock = defaultClock, logger = silentLogger, sessionGapMs = 30 * 60 * 1000, modelTimeoutMs = 10_000} = {}) {
  for (const [name, value] of Object.entries({principalRepresentationReader, interpretationSessionStore, primaryModelClient})) if (!value) throw new Error(`${name} is required`);
  return {
    async interpretMessage({message, trigger} = {}) {
      if (!message?.id || !message.content || !message.createdAt) throw new Error("message id, content, and createdAt are required");
      const startedAt = clock.now();
      const [current, data] = await Promise.all([interpretationSessionStore.getCurrent(), principalRepresentationReader.read({message, trigger})]);
      const sessionAction = decideSession(current, message, clock, sessionGapMs);
      const context = buildContext({message, trigger, data, session: current, sessionAction});
      const primaryRaw = await safeComplete(primaryModelClient, context, "primary", modelTimeoutMs);
      const primaryValidation = primaryRaw.error ? {ok: false, errors: [primaryRaw.error]} : validateProposal(primaryRaw);
      let gateResult = gate({validation: primaryValidation, context, message, expectedSessionAction: sessionAction});
      let finalValidation = primaryValidation, deep = null;
      if (gateResult.decision === "escalate") {
        const deepRaw = await safeComplete(deepModelClient, context, "deep", modelTimeoutMs);
        deep = deepRaw;
        const deepValidation = deepRaw.error ? {ok: false, errors: [deepRaw.error]} : validateProposal(deepRaw);
        if (deepValidation.ok) { finalValidation = deepValidation; gateResult = {decision: deepValidation.value.requiredNextMove === "clarify" ? "clarify" : "accept", reasons: ["deep_proposal_selected", ...gateResult.reasons]}; }
        else { finalValidation = deepValidation; gateResult = {decision: "fail", reasons: ["deep_validation_failed", ...deepValidation.errors]}; }
      }
      let proposal = finalValidation.ok ? finalValidation.value : null;
      if (proposal) {
        proposal = {...proposal, processingMetadata: {...proposal.processingMetadata, path: deep ? "deep" : "primary", latencyMs: clock.now().getTime() - startedAt.getTime()}};
        const next = {id: sessionAction === "continue" ? current.id : `session-${message.id}`, startedAt: sessionAction === "continue" ? current.startedAt : clock.now().toISOString(), lastMessageAt: message.createdAt, recentMessages: [...(sessionAction === "continue" ? current.recentMessages ?? [] : []), {id: message.id, content: message.content}], pendingQuestions: [], expectedNextMove: proposal.requiredNextMove, caseIds: proposal.affectedCases};
        await interpretationSessionStore.save(next);
      }
      logger.debug("message interpreted", {messageId: message.id, decision: gateResult.decision});
      return {sessionAction, context, primary: primaryValidation.ok ? primaryValidation.value : {errors: primaryValidation.errors}, gate: gateResult, deep, proposal, latencyMs: clock.now().getTime() - startedAt.getTime()};
    }
  };
}
async function safeComplete(client, context, mode, timeoutMs) {
  let timer;
  try {
    const result = await Promise.race([
      client.complete({context, mode}),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), timeoutMs); })
    ]);
    return parseModelResult(result);
  } catch (error) { return {error: `model_${mode}_failure: ${error.message}`}; }
  finally { clearTimeout(timer); }
}
