// @ts-check

/**
 * @namespace Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader
 * @description Process-local Principal data reader for deterministic probes and tests.
 */

export default class InMemoryPrincipalRepresentationReader {
  /**
   * @param {object} [data] Supplied Principal data.
   * @param {object} [data.representation] Current Principal representation.
   * @param {object} [data.state] Current Principal state.
   * @param {object[]} [data.cases] Relevant Cases.
   */
  constructor({representation = {}, state = {}, cases = []} = {}) {
    /**
     * Reads the configured deterministic data.
     * @returns {Promise<{representation: object, state: object, cases: object[]}>} Principal data.
     */
    this.read = async function () { return {representation, state, cases}; };
  }
}

/** Factory for transient deterministic readers. */
export class Factory {
  /** Creates the reader factory. */
  constructor() {
    /**
     * @param {object} data Supplied Principal data.
     * @returns {Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader$} Reader instance.
     */
    this.create = function (data) { return new InMemoryPrincipalRepresentationReader(data); };
  }
}
