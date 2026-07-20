// @ts-check

/**
 * @namespace Alarisa_Back_Control_Config_OpenAiSmoke
 * @description Immutable runtime configuration for the OpenAI smoke adapter.
 */

export class Data {
  /** @type {string|undefined} */ apiKey;
  /** @type {string|undefined} */ model;
  /** @type {string|undefined} */ baseUrl;
  /** @type {number|undefined} */ maxOutputTokens;
  /** @type {number|undefined} */ maxContextBytes;
  /** @type {number|undefined} */ maxCostUsd;
}

const cfg = new Data();
const facade = {};
let frozen = false;

/** @type {Alarisa_Back_Control_Config_OpenAiSmoke$} */
const proxy = new Proxy(facade, {
  get(_target, prop) {
    const isServiceProp = prop === "then" || typeof prop === "symbol";
    if (!frozen && !isServiceProp) throw new Error("OpenAI smoke configuration is not initialized.");
    return cfg[prop];
  },
  set() { throw new Error("OpenAI smoke configuration is immutable."); },
  defineProperty() { throw new Error("OpenAI smoke configuration is immutable."); },
  deleteProperty() { throw new Error("OpenAI smoke configuration is immutable."); },
  preventExtensions() { throw new Error("OpenAI smoke configuration wrapper cannot be frozen."); },
});

/** Read-only runtime configuration wrapper. */
export default class Wrapper {
  /** Creates the immutable configuration wrapper. */
  constructor() { return proxy; }
}

/** Factory for OpenAI smoke runtime configuration. */
export class Factory {
  /** Creates the OpenAI smoke configuration factory. */
  constructor() {
    /** @param {object} params Runtime values supplied by a composition root. */
    this.configure = function (params = {}) {
      if (frozen) throw new Error("OpenAI smoke configuration is frozen.");
      if (cfg.apiKey === undefined && params.apiKey !== undefined) cfg.apiKey = String(params.apiKey).trim();
      if (cfg.model === undefined && params.model !== undefined) cfg.model = String(params.model);
      if (cfg.baseUrl === undefined && params.baseUrl !== undefined) cfg.baseUrl = String(params.baseUrl).replace(/\/$/, "");
      if (cfg.maxOutputTokens === undefined && params.maxOutputTokens !== undefined) cfg.maxOutputTokens = Number(params.maxOutputTokens);
      if (cfg.maxContextBytes === undefined && params.maxContextBytes !== undefined) cfg.maxContextBytes = Number(params.maxContextBytes);
      if (cfg.maxCostUsd === undefined && params.maxCostUsd !== undefined) cfg.maxCostUsd = Number(params.maxCostUsd);
    };
    /** @returns {Alarisa_Back_Control_Config_OpenAiSmoke$} Frozen configuration. */
    this.freeze = function () {
      if (frozen) return proxy;
      if (!cfg.apiKey?.trim()) throw new Error("OpenAI smoke API key is required");
      if (cfg.model !== "gpt-5.6-terra") throw new Error(`Unsupported OpenAI smoke model: ${cfg.model}`);
      if (cfg.baseUrl === undefined) cfg.baseUrl = "https://api.openai.com/v1";
      if (cfg.maxOutputTokens === undefined) cfg.maxOutputTokens = 256;
      if (cfg.maxContextBytes === undefined) cfg.maxContextBytes = 8192;
      if (cfg.maxCostUsd === undefined) cfg.maxCostUsd = 0.10;
      if (!Number.isInteger(cfg.maxOutputTokens) || cfg.maxOutputTokens < 1) throw new Error("maxOutputTokens must be a positive integer");
      if (!Number.isInteger(cfg.maxContextBytes) || cfg.maxContextBytes < 1) throw new Error("maxContextBytes must be a positive integer");
      if (!(cfg.maxCostUsd > 0)) throw new Error("maxCostUsd must be positive");
      Object.freeze(cfg);
      frozen = true;
      return proxy;
    };
  }
}
