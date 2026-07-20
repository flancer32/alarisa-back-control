// @ts-check

/**
 * @namespace Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader
 * @description Process-local Principal data reader for deterministic probes and tests.
 */

export default class InMemoryPrincipalRepresentationReader {
  /**
   * @param {object} config Supplied Principal data.
   */
  constructor(config = {}) {
    const {representation = {}, state = {}, cases = []} = config;
    /**
     * Reads the configured deterministic data.
     * @returns {Promise<object>} Principal data.
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
