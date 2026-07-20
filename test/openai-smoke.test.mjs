import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import Container from "@teqfw/di";
import NamespaceRegistry from "@teqfw/di/src/Config/NamespaceRegistry.mjs";
import OpenAIResponsesModelClient from "../src/Adapter/OpenAIResponsesModelClient.mjs";
import Proposal from "../src/Proposal.mjs";
import Plane from "../src/Plane.mjs";
import InMemoryPrincipalRepresentationReader from "../src/Adapter/InMemoryPrincipalRepresentationReader.mjs";
import InMemoryInterpretationSessionStore from "../src/Adapter/InMemoryInterpretationSessionStore.mjs";

const proposalValue = Object.freeze({
  sessionAction: "continue", understoodMeaning: "The Principal confirms the public smoke scenario.", communicativeIntent: "confirm",
  referencedEntities: [], affectedCases: ["case-smoke"], semanticChanges: [], signalCandidates: [], ambiguities: [], requiredNextMove: "proceed",
  confidenceEvidence: ["explicit confirmation"], processingMetadata: {needsMoreContext: false},
});
const context = Object.freeze({currentMessage: {id: "m1", content: "Yes", createdAt: "2026-07-20T09:59:00.000Z"}, relevantCases: [{id: "case-smoke"}]});

function config(params = {}) {
  return Object.freeze({apiKey: "test-key", model: "gpt-5.6-terra", baseUrl: "https://api.openai.com/v1", maxOutputTokens: 256, maxContextBytes: 8192, maxCostUsd: 0.10, ...params});
}

function response(value = proposalValue) {
  return new Response(JSON.stringify({id: "resp_test", model: "gpt-5.6-terra", usage: {input_tokens: 120, output_tokens: 40}, output: [{type: "message", content: [{type: "output_text", text: JSON.stringify(value)}]}]}), {status: 200, headers: {"x-request-id": "req_test"}});
}

test("OpenAI adapter requests strict proposal JSON and exposes safe diagnostics", async () => {
  let request;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (...args) => { request = args; return response(); };
  const client = new OpenAIResponsesModelClient({config: config(), proposal: new Proposal()});
  const value = await client.complete({context, mode: "primary"});
  globalThis.fetch = originalFetch;
  const [url, init] = request;
  const body = JSON.parse(init.body);
  assert.equal(url, "https://api.openai.com/v1/responses");
  assert.equal(init.headers.Authorization, "Bearer test-key");
  assert.equal(body.model, "gpt-5.6-terra");
  assert.equal(body.text.format.type, "json_schema");
  assert.equal(body.text.format.strict, true);
  assert.deepEqual(value, proposalValue);
  const diagnostics = client.getLastDiagnostics();
  assert.deepEqual({...diagnostics, maximumCostUsd: undefined}, {model: "gpt-5.6-terra", requestId: "req_test", usage: {input_tokens: 120, output_tokens: 40}, estimatedCostUsd: 0.0009, maximumCostUsd: undefined});
  assert.ok(diagnostics.maximumCostUsd > 0 && diagnostics.maximumCostUsd < 0.10);
});

test("OpenAI adapter maps provider failure without exposing response content", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({error: {message: "rate limited"}}), {status: 429});
  const client = new OpenAIResponsesModelClient({config: config(), proposal: new Proposal()});
  await assert.rejects(client.complete({context, mode: "primary"}), /OpenAI API request failed with status 429/);
  assert.deepEqual(client.getLastDiagnostics(), {model: "gpt-5.6-terra", requestId: null, status: 429, errorType: null, errorCode: null});
  globalThis.fetch = originalFetch;
});

test("DI-composed smoke path returns a validated proposal and saves the session", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => response();
  const client = new OpenAIResponsesModelClient({config: config(), proposal: new Proposal()});
  const store = new InMemoryInterpretationSessionStore({id: "s1", startedAt: "2026-07-20T09:00:00.000Z", lastMessageAt: "2026-07-20T09:58:00.000Z", recentMessages: [], pendingQuestions: []});
  const plane = new Plane({proposal: new Proposal()}).create({
    principalRepresentationReader: new InMemoryPrincipalRepresentationReader({representation: {name: "Public Test Principal"}, state: {}, cases: [{id: "case-smoke"}]}),
    interpretationSessionStore: store,
    primaryModelClient: client,
    deepModelClient: {complete: async () => { throw new Error("Deep disabled"); }},
    clock: {now: () => new Date("2026-07-20T10:00:00.000Z")},
  });
  const result = await plane.interpretMessage({message: {id: "m1", content: "Yes", createdAt: "2026-07-20T09:59:00.000Z"}});
  assert.equal(result.gate.decision, "accept");
  assert.deepEqual(result.proposal, {...proposalValue, processingMetadata: {...proposalValue.processingMetadata, path: "primary", latencyMs: 0}});
  assert.equal(result.providerDiagnostics.primary.requestId, "req_test");
  assert.equal((await store.getCurrent()).id, "s1");
  globalThis.fetch = originalFetch;
});

test("OpenAI adapter rejects oversized contexts and over-budget policy before a request", async () => {
  const client = new OpenAIResponsesModelClient({config: config({maxContextBytes: 10}), proposal: new Proposal()});
  await assert.rejects(client.complete({context, mode: "primary"}), /context exceeds/);
  const costly = new OpenAIResponsesModelClient({config: config({maxCostUsd: 0.001}), proposal: new Proposal()});
  await assert.rejects(costly.complete({context: {}, mode: "primary"}), /maximum cost/);
});

test("OpenAI adapter receives frozen smoke settings through TeqFW DI", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => response();
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const container = new Container();
  const registry = new NamespaceRegistry({fs, path, appRoot: root});
  for (const entry of await registry.build()) container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
  const configFactory = await container.get("Alarisa_Back_Control_Config_OpenAiSmoke__Factory$");
  configFactory.configure({apiKey: "test-key", model: "gpt-5.6-terra"});
  configFactory.freeze();
  const client = await container.get("Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient$");
  assert.deepEqual(await client.complete({context, mode: "primary"}), proposalValue);
  globalThis.fetch = originalFetch;
});
