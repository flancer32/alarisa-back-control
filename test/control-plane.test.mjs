import test from "node:test";
import assert from "node:assert/strict";
import Plane from "../src/Plane.mjs";
import Proposal from "../src/Proposal.mjs";
import InMemoryPrincipalRepresentationReader from "../src/Adapter/InMemoryPrincipalRepresentationReader.mjs";
import InMemoryInterpretationSessionStore from "../src/Adapter/InMemoryInterpretationSessionStore.mjs";
import ScriptedModelClient from "../src/Adapter/ScriptedModelClient.mjs";

const now = new Date("2026-07-17T10:00:00.000Z");
const clock = {now: () => now};
const message = (id, content = "Yes", createdAt = "2026-07-17T09:59:00.000Z", extra = {}) => ({id, content, createdAt, channel: "mob", ...extra});
const proposal = (extra = {}) => ({sessionAction: "continue", understoodMeaning: "Confirm current choice.", communicativeIntent: "confirm", referencedEntities: [], affectedCases: ["case-a"], semanticChanges: [], signalCandidates: [], ambiguities: [], requiredNextMove: "proceed", confidenceEvidence: ["reply context"], processingMetadata: {}, ...extra});
function plane(primaryResponses, deepResponses = {}, current = {id:"s1", startedAt:"2026-07-17T09:00:00Z", lastMessageAt:"2026-07-17T09:58:00Z", recentMessages:[], pendingQuestions:[]}) {
  const store = new InMemoryInterpretationSessionStore(current);
  const cp = new Plane({proposal: new Proposal()}).create({principalRepresentationReader:new InMemoryPrincipalRepresentationReader({representation:{name:"Alex"},state:{},cases:[{id:"case-a"},{id:"case-b"}]}), interpretationSessionStore:store, primaryModelClient:new ScriptedModelClient(primaryResponses), deepModelClient:new ScriptedModelClient(deepResponses), clock});
  return {store, cp};
}

test("continues a connected session and saves a logical session", async () => {
  const {cp, store} = plane({"primary:m1": proposal()}); const result = await cp.interpretMessage({message:message("m1")});
  assert.equal(result.gate.decision, "accept"); assert.equal(result.sessionAction, "continue"); assert.equal((await store.getCurrent()).id, "s1");
});
test("starts a new session after a meaningful gap without prior prose", async () => {
  const {cp, store} = plane({"primary:m2": proposal({sessionAction:"start_new"})}, {}, {id:"old",lastMessageAt:"2026-07-17T08:00:00Z",recentMessages:[{content:"old summary"}]});
  const result = await cp.interpretMessage({message:message("m2", "New topic")});
  assert.equal(result.sessionAction, "start_new"); assert.equal(result.context.currentInterpretationSession, null); assert.equal((await store.getCurrent()).id, "session-m2");
});
test("replyTo continues an old event even after a gap", async () => {
  const {cp} = plane({"primary:m3": proposal()}); const result = await cp.interpretMessage({message:message("m3", "Late reply", "2026-07-17T10:00:00Z", {replyTo:"old-event"})}); assert.equal(result.sessionAction,"continue");
});
test("malformed Primary result escalates and a valid Deep result wins", async () => {
  const {cp} = plane({"primary:m4":"not json"}, {"deep:m4":proposal()}); const result = await cp.interpretMessage({message:message("m4")}); assert.equal(result.proposal.processingMetadata.path,"deep"); assert.equal(result.gate.decision,"accept");
});
test("unresolved case reference is rejected by gate and improved by Deep", async () => {
  const {cp} = plane({"primary:m5":proposal({affectedCases:["missing"]})}, {"deep:m5":proposal({affectedCases:["case-a","case-b"]})}); const result=await cp.interpretMessage({message:message("m5")}); assert.deepEqual(result.proposal.affectedCases,["case-a","case-b"]);
});
test("ambiguous deep result recommends clarification", async () => {
  const {cp} = plane({"primary:m6":proposal({ambiguities:["target"]})}, {"deep:m6":proposal({requiredNextMove:"clarify"})}); const result=await cp.interpretMessage({message:message("m6")}); assert.equal(result.proposal.requiredNextMove,"clarify"); assert.equal(result.gate.decision,"clarify");
});
test("one session may involve several Cases", async () => { const {cp} = plane({"primary:m7":proposal({affectedCases:["case-a","case-b"]})}); const result=await cp.interpretMessage({message:message("m7")}); assert.deepEqual(result.proposal.affectedCases,["case-a","case-b"]); });
test("topic switch can remain in the same human discussion session", async () => { const {cp} = plane({"primary:m7b":proposal({understoodMeaning:"Switch implementation topic inside the current discussion."})}); const result=await cp.interpretMessage({message:message("m7b","Now discuss the probe CLI.")}); assert.equal(result.sessionAction,"continue"); });
test("consequential message takes the Deep path", async () => { const {cp} = plane({"primary:m8":proposal()}, {"deep:m8":proposal()}); const result=await cp.interpretMessage({message:message("m8","Delete it","2026-07-17T09:59:00Z",{significantConsequences:true})}); assert.equal(result.proposal.processingMetadata.path,"deep"); });
test("contradiction with Principal Representation takes the Deep path", async () => { const {cp} = plane({"primary:m9":proposal({referencedEntities:[{contradictsRepresentation:true}]})}, {"deep:m9":proposal()}); const result=await cp.interpretMessage({message:message("m9")}); assert.equal(result.proposal.processingMetadata.path,"deep"); });
test("provider-session loss is irrelevant to a persisted logical session", async () => { const {cp} = plane({"primary:m10":proposal()}); const result=await cp.interpretMessage({message:message("m10")}); assert.equal(result.context.currentInterpretationSession.id,"s1"); });
test("timeout is an explicit adapter failure", async () => { const store=new InMemoryInterpretationSessionStore({id:"s",lastMessageAt:"2026-07-17T09:58:00Z"}); const cp=new Plane({proposal:new Proposal()}).create({principalRepresentationReader:new InMemoryPrincipalRepresentationReader({cases:[]}),interpretationSessionStore:store,primaryModelClient:{complete:()=>new Promise(()=>{})},deepModelClient:{complete:()=>new Promise(()=>{})},clock,modelTimeoutMs:1}); const result=await cp.interpretMessage({message:message("m11")}); assert.equal(result.gate.decision,"fail"); });
test("proposal validation rejects unknown enums and missing meaning", () => { assert.equal(new Proposal().validate({sessionAction:"no",understoodMeaning:"",communicativeIntent:"",referencedEntities:[],affectedCases:[],semanticChanges:[],signalCandidates:[],ambiguities:[],requiredNextMove:"x",confidenceEvidence:[],processingMetadata:{}}).ok,false); });
