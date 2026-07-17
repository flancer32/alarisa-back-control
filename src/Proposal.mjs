// @ts-check

/**
 * @namespace Alarisa_Back_Control_Proposal
 * @description Validates provisional semantic interpretation proposals.
 */

const ACTIONS = new Set(["continue", "start_new"]);
const MOVES = new Set(["proceed", "clarify", "wait"]);

export default class Proposal {
  /** Creates the stateless proposal-schema service. */
  constructor() {
    /**
     * Creates the minimal proposal shape.
     * @param {string} sessionAction Expected logical-session action.
     * @returns {object} Empty proposal.
     */
    this.empty = function (sessionAction = "start_new") {
      return {
        sessionAction, understoodMeaning: "", communicativeIntent: "", referencedEntities: [], affectedCases: [],
        semanticChanges: [], signalCandidates: [], ambiguities: [], requiredNextMove: "proceed",
        confidenceEvidence: [], processingMetadata: {},
      };
    };

    /**
     * Validates and normalizes a model result into a proposal shape.
     * @param {unknown} value Candidate proposal.
     * @returns {object} Validation result.
     */
    this.validate = function (value) {
      const errors = [];
      if (!value || typeof value !== "object" || Array.isArray(value)) return {ok: false, errors: ["proposal must be an object"]};
      const proposal = {...this.empty(), ...value};
      for (const key of ["understoodMeaning", "communicativeIntent"]) if (!proposal[key].trim?.()) errors.push(`${key} is required`);
      for (const key of ["referencedEntities", "affectedCases", "semanticChanges", "signalCandidates", "ambiguities", "confidenceEvidence"]) {
        if (!Array.isArray(proposal[key])) errors.push(`${key} must be an array`);
      }
      if (!ACTIONS.has(proposal.sessionAction)) errors.push("unknown sessionAction");
      if (!MOVES.has(proposal.requiredNextMove)) errors.push("unknown requiredNextMove");
      if (!proposal.processingMetadata || typeof proposal.processingMetadata !== "object") errors.push("processingMetadata must be an object");
      return errors.length ? {ok: false, errors} : {ok: true, value: proposal};
    };
  }
}
