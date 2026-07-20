// @ts-check

/**
 * @namespace Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore
 * @description Process-local logical-session store for deterministic probes and tests.
 */

export default class InMemoryInterpretationSessionStore {
  /**
   * @param {object} current Initial logical session, if one exists.
   */
  constructor(current = null) {
    /** @returns {Promise<object|null>} Current logical session. */
    this.getCurrent = async function () { return current; };
    /**
     * @param {object} session Next logical session.
     * @returns {Promise<object>} Saved logical session.
     */
    this.save = async function (session) { current = session; return session; };
  }
}

/** Factory for transient deterministic session stores. */
export class Factory {
  /** Creates the session-store factory. */
  constructor() {
    /**
     * @param {object|null} current Initial logical session.
     * @returns {Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore$} Session store.
     */
    this.create = function (current) { return new InMemoryInterpretationSessionStore(current); };
  }
}
