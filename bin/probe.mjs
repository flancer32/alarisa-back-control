#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import Container from "@teqfw/di";
import NamespaceRegistry from "@teqfw/di/src/Config/NamespaceRegistry.mjs";

const file = process.argv[2];
if (!file) throw new Error("Usage: npm run probe -- scenarios/continuous-discussion.json");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const container = new Container();
const registry = new NamespaceRegistry({fs, path, appRoot: projectRoot});
for (const entry of await registry.build()) container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
const scenario = JSON.parse(await fs.readFile(file, "utf8"));
const readerFactory = await container.get("Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader__Factory$");
const storeFactory = await container.get("Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore__Factory$");
const clientFactory = await container.get("Alarisa_Back_Control_Adapter_ScriptedModelClient__Factory$");
const plane = (await container.get("Alarisa_Back_Control_Plane$")).create({
  principalRepresentationReader: readerFactory.create(scenario),
  interpretationSessionStore: storeFactory.create(scenario.currentSession),
  primaryModelClient: clientFactory.create(scenario.primaryResponses),
  deepModelClient: clientFactory.create(scenario.deepResponses ?? {}),
  clock: {now: () => new Date(scenario.now ?? "2026-07-17T10:00:00.000Z")},
});
for (const message of scenario.messages) {
  const result = await plane.interpretMessage({message});
  console.log(JSON.stringify({messageId: message.id, sessionAction: result.sessionAction, context: {session: result.context.currentInterpretationSession?.id ?? null, caseIds: result.context.relevantCases.map((item) => item.id), pendingQuestions: result.context.pendingQuestions}, primary: result.primary, gate: result.gate, deepInvoked: Boolean(result.deep), proposal: result.proposal, latencyMs: result.latencyMs}, null, 2));
}
