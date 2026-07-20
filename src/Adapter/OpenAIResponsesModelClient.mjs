// @ts-check

/**
 * @namespace Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient
 * @description Adapts OpenAI Responses structured output to the provider-neutral model-client contract.
 */

const INPUT_PER_MILLION_USD = 2.5;
const OUTPUT_PER_MILLION_USD = 15;
const SCHEMA_OVERHEAD_BYTES = 4096;

/** @param {object} response OpenAI Responses API body. @returns {string} Structured output text. */
function outputText(response) {
  if (typeof response?.output_text === "string") return response.output_text;
  const parts = (response?.output ?? []).flatMap((item) => item?.content ?? []).filter((item) => item?.type === "output_text").map((item) => item.text);
  if (parts.length) return parts.join("\n");
  const refusal = (response?.output ?? []).flatMap((item) => item?.content ?? []).find((item) => item?.type === "refusal");
  if (refusal) throw new Error("OpenAI model refused the request");
  throw new Error("OpenAI response contains no output text");
}

/** @param {number} inputTokens @param {number} outputTokens @returns {number} Estimated cost. */
function estimateCost(inputTokens, outputTokens) {
  return (inputTokens * INPUT_PER_MILLION_USD + outputTokens * OUTPUT_PER_MILLION_USD) / 1_000_000;
}

export default class OpenAIResponsesModelClient {
  /**
   * @param {object} deps
   * @param {Alarisa_Back_Control_Config_OpenAiSmoke$} deps.config Immutable smoke configuration.
   * @param {Alarisa_Back_Control_Proposal$} deps.proposal Common proposal schema service.
   */
  constructor({config, proposal}) {
    let lastDiagnostics = null;
    /** @returns {object|null} Safe diagnostics for the latest provider call. */
    this.getLastDiagnostics = function () { return lastDiagnostics && {...lastDiagnostics}; };
    /**
     * @param {object} deps Model request.
     * @param {object} deps.context Interpretation Context.
     * @param {string} deps.mode Requested interpretation mode.
     * @returns {Promise<unknown>} Provider-neutral proposal candidate.
     */
    this.complete = async function ({context, mode}) {
      if (mode !== "primary") throw new Error("OpenAI smoke adapter supports Primary interpretation only");
      const serialized = JSON.stringify(context);
      const bytes = Buffer.byteLength(serialized, "utf8");
      if (bytes > config.maxContextBytes) throw new Error(`OpenAI smoke context exceeds ${config.maxContextBytes} bytes`);
      const maximumCostUsd = estimateCost(bytes + SCHEMA_OVERHEAD_BYTES, config.maxOutputTokens);
      if (maximumCostUsd > config.maxCostUsd) throw new Error(`OpenAI smoke maximum cost ${maximumCostUsd.toFixed(6)} exceeds ${config.maxCostUsd.toFixed(2)}`);
      const response = await fetch(`${config.baseUrl}/responses`, {
        method: "POST",
        headers: {Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json"},
        body: JSON.stringify({
          model: config.model,
          input: [
            {role: "developer", content: [{type: "input_text", text: "Return a Semantic Interpretation Proposal that conforms exactly to the supplied schema. It remains provisional, not domain truth."}]},
            {role: "user", content: [{type: "input_text", text: serialized}]},
          ],
          text: {format: {type: "json_schema", name: "semantic_interpretation_proposal", strict: true, schema: proposal.getJsonSchema()}},
          max_output_tokens: config.maxOutputTokens,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        lastDiagnostics = {
          model: config.model,
          requestId: response.headers.get("x-request-id") ?? null,
          status: response.status,
          errorType: body?.error?.type ?? null,
          errorCode: body?.error?.code ?? null,
        };
        throw new Error(`OpenAI API request failed with status ${response.status}`);
      }
      const body = await response.json();
      lastDiagnostics = {
        model: body.model ?? config.model,
        requestId: response.headers.get("x-request-id") ?? null,
        usage: body.usage ?? null,
        estimatedCostUsd: Number.isFinite(body.usage?.input_tokens) && Number.isFinite(body.usage?.output_tokens) ? estimateCost(body.usage.input_tokens, body.usage.output_tokens) : null,
        maximumCostUsd,
      };
      try { return JSON.parse(outputText(body)); }
      catch { throw new Error("OpenAI structured output is not valid JSON"); }
    };
  }
}

/** Factory for OpenAI Responses model clients. */
export class Factory {
  /**
   * @param {object} deps
   * @param {Alarisa_Back_Control_Config_OpenAiSmoke$} deps.config
   * @param {Alarisa_Back_Control_Proposal$} deps.proposal
   */
  constructor({config, proposal}) {
    /** @returns {Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient$} Model client. */
    this.create = function () { return new OpenAIResponsesModelClient({config, proposal}); };
  }
}

export const __deps__ = Object.freeze({
  default: Object.freeze({config: "Alarisa_Back_Control_Config_OpenAiSmoke$", proposal: "Alarisa_Back_Control_Proposal$"}),
  Factory: Object.freeze({config: "Alarisa_Back_Control_Config_OpenAiSmoke$", proposal: "Alarisa_Back_Control_Proposal$"}),
});
