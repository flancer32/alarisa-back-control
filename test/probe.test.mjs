import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {createProbe} from "./Bootstrap.mjs";

test("probe executes a deterministic escalation scenario", async () => {
  const scenario = JSON.parse(await fs.readFile("scenarios/ambiguous-confirmation.json", "utf8"));
  const probe = await createProbe(scenario);
  const result = await probe.interpretMessage({message: scenario.messages[0]});
  assert.equal(Boolean(result.deep), true);
  assert.equal(result.gate.decision, "clarify");
});
