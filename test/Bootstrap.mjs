import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import Container from "@teqfw/di";
import NamespaceRegistry from "@teqfw/di/src/Config/NamespaceRegistry.mjs";

const directory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(directory, "..");

export async function createProbe(scenario) {
  const container = new Container();
  const namespaceRegistry = new NamespaceRegistry({fs, path, appRoot: projectRoot});
  for (const entry of await namespaceRegistry.build()) container.addNamespaceRoot(entry.prefix, entry.dirAbs, entry.ext);
  const readerFactory = await container.get("Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader__Factory$");
  const storeFactory = await container.get("Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore__Factory$");
  const modelClientFactory = await container.get("Alarisa_Back_Control_Adapter_ScriptedModelClient__Factory$");
  const controlPlane = await container.get("Alarisa_Back_Control_Plane$");
  return controlPlane.create({
    principalRepresentationReader: readerFactory.create(scenario),
    interpretationSessionStore: storeFactory.create(scenario.currentSession),
    primaryModelClient: modelClientFactory.create(scenario.primaryResponses),
    deepModelClient: modelClientFactory.create(scenario.deepResponses ?? {}),
    clock: {now: () => new Date(scenario.now ?? "2026-07-17T10:00:00.000Z")},
  });
}
