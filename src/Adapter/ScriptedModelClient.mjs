// @ts-check

/**
 * @namespace Alarisa_Back_Control_Adapter_ScriptedModelClient
 * @description Returns deterministic scripted Primary or Deep model responses.
 */

export default class ScriptedModelClient {
  /**
   * @param {object} [responses] Responses indexed by mode, message identifier, or both.
   */
  constructor(responses = {}) {
    const calls = [];
    /** @returns {object[]} Recorded model invocations. */
    this.getCalls = function () { return [...calls]; };
    /**
     * @param {object} request Model request.
     * @param {object} request.context Assembled interpretation context.
     * @param {string} request.mode Requested interpretation mode.
     * @returns {Promise<unknown>} Scripted response.
     */
    this.complete = async function ({context, mode}) {
      calls.push({messageId: context.currentMessage.id, mode});
      const value = responses[`${mode}:${context.currentMessage.id}`] ?? responses[mode] ?? responses[context.currentMessage.id];
      if (value instanceof Error) throw value;
      if (value === undefined) throw new Error(`No scripted ${mode} response for ${context.currentMessage.id}`);
      return typeof value === "function" ? value({context, mode}) : value;
    };
  }
}

/** Factory for transient scripted model clients. */
export class Factory {
  /** Creates the scripted-model-client factory. */
  constructor() {
    /**
     * @param {object} responses Responses indexed by mode, message identifier, or both.
     * @returns {Alarisa_Back_Control_Adapter_ScriptedModelClient$} Model client.
     */
    this.create = function (responses) { return new ScriptedModelClient(responses); };
  }
}
