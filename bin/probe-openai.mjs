#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import Container from "@teqfw/di";
import NamespaceRegistry from "@teqfw/di/src/Config/NamespaceRegistry.mjs";

const file = process.argv[2];
if (!file) throw new Error("Usage: npm run probe:openai -- scenarios/openai-smoke.json");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const container = new Container();
const registry = new NamespaceRegistry({fs, path, appRoot: projectRoot});
for (const entry of await registry.build()) container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
const scenario = JSON.parse(await fs.readFile(file, "utf8"));
const configFactory = await container.get("Alarisa_Back_Control_Config_OpenAiSmoke__Factory$");
configFactory.configure({apiKey: process.env.ALARISA_CONTROL_PROVIDER_API_KEY, model: process.env.ALARISA_CONTROL_SMOKE_MODEL});
configFactory.freeze();
const readerFactory = await container.get("Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader__Factory$");
const storeFactory = await container.get("Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore__Factory$");
const primaryModelClient = await container.get("Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient$");
const disabledDeepClient = Object.freeze({complete: async () => { throw new Error("Deep interpretation is disabled for OpenAI smoke probes"); }});
const plane = (await container.get("Alarisa_Back_Control_Plane$")).create({
  principalRepresentationReader: readerFactory.create(scenario),
  interpretationSessionStore: storeFactory.create(scenario.currentSession),
  primaryModelClient,
  deepModelClient: disabledDeepClient,
  clock: {now: () => new Date(scenario.now ?? "2026-07-20T10:00:00.000Z")},
  modelTimeoutMs: 20_000,
});
for (const message of scenario.messages) {
  const result = await plane.interpretMessage({message});
  console.log(JSON.stringify({messageId: message.id, sessionAction: result.sessionAction, primary: result.primary, gate: result.gate, proposal: result.proposal, providerDiagnostics: result.providerDiagnostics, latencyMs: result.latencyMs}, null, 2));
}
