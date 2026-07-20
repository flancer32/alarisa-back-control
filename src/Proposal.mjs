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
    /** @returns {object} Strict JSON Schema for provider structured output. */
    this.getJsonSchema = function () {
      return {
        type: "object", additionalProperties: false,
        properties: {
          sessionAction: {type: "string", enum: ["continue", "start_new"]},
          understoodMeaning: {type: "string"},
          communicativeIntent: {type: "string"},
          referencedEntities: {type: "array", items: {type: "object", additionalProperties: false, properties: {id: {type: "string"}, name: {type: "string"}, type: {type: "string"}, contradictsRepresentation: {type: "boolean"}}, required: ["id", "name", "type", "contradictsRepresentation"]}},
          affectedCases: {type: "array", items: {type: "string"}},
          semanticChanges: {type: "array", items: {type: "object", additionalProperties: false, properties: {type: {type: "string"}, target: {type: "string"}, value: {type: "string"}}, required: ["type", "target", "value"]}},
          signalCandidates: {type: "array", items: {type: "object", additionalProperties: false, properties: {type: {type: "string"}, meaning: {type: "string"}, consequential: {type: "boolean"}}, required: ["type", "meaning", "consequential"]}},
          ambiguities: {type: "array", items: {type: "string"}},
          requiredNextMove: {type: "string", enum: ["proceed", "clarify", "wait"]},
          confidenceEvidence: {type: "array", items: {type: "string"}},
          processingMetadata: {type: "object", additionalProperties: false, properties: {needsMoreContext: {type: "boolean"}}, required: ["needsMoreContext"]},
        },
        required: ["sessionAction", "understoodMeaning", "communicativeIntent", "referencedEntities", "affectedCases", "semanticChanges", "signalCandidates", "ambiguities", "requiredNextMove", "confidenceEvidence", "processingMetadata"],
      };
    };
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
