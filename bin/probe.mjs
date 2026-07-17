#!/usr/bin/env node
import fs from "node:fs/promises";
import {createControlPlane, InMemoryPrincipalRepresentationReader, InMemoryInterpretationSessionStore, ScriptedModelClient} from "../src/index.mjs";

const file = process.argv[2];
if (!file) throw new Error("Usage: npm run probe -- scenarios/continuous-discussion.json");
const scenario = JSON.parse(await fs.readFile(file, "utf8"));
const primary = new ScriptedModelClient(scenario.primaryResponses);
const deep = new ScriptedModelClient(scenario.deepResponses ?? {});
const plane = createControlPlane({
  principalRepresentationReader: new InMemoryPrincipalRepresentationReader(scenario),
  interpretationSessionStore: new InMemoryInterpretationSessionStore(scenario.currentSession),
  primaryModelClient: primary, deepModelClient: deep,
  clock: {now: () => new Date(scenario.now ?? "2026-07-17T10:00:00.000Z")}
});
for (const message of scenario.messages) {
  const result = await plane.interpretMessage({message});
  console.log(JSON.stringify({messageId: message.id, sessionAction: result.sessionAction, context: {session: result.context.currentInterpretationSession?.id ?? null, caseIds: result.context.relevantCases.map(x => x.id), pendingQuestions: result.context.pendingQuestions}, primary: result.primary, gate: result.gate, deepInvoked: Boolean(result.deep), proposal: result.proposal, latencyMs: result.latencyMs}, null, 2));
}
