import test from "node:test";
import assert from "node:assert/strict";
import {execFile} from "node:child_process";
import {promisify} from "node:util";

const exec = promisify(execFile);

test("probe executes a deterministic escalation scenario", async () => {
  const {stdout} = await exec(process.execPath, ["bin/probe.mjs", "scenarios/ambiguous-confirmation.json"]);
  assert.match(stdout, /"deepInvoked": true/);
  assert.match(stdout, /"decision": "clarify"/);
});
