declare global {
  type Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore = typeof import("./src/Adapter/InMemoryInterpretationSessionStore.mjs").default;
  type Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore$ = InstanceType<Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore>;
  type Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore__Factory = typeof import("./src/Adapter/InMemoryInterpretationSessionStore.mjs").Factory;
  type Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore__Factory$ = InstanceType<Alarisa_Back_Control_Adapter_InMemoryInterpretationSessionStore__Factory>;

  type Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader = typeof import("./src/Adapter/InMemoryPrincipalRepresentationReader.mjs").default;
  type Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader$ = InstanceType<Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader>;
  type Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader__Factory = typeof import("./src/Adapter/InMemoryPrincipalRepresentationReader.mjs").Factory;
  type Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader__Factory$ = InstanceType<Alarisa_Back_Control_Adapter_InMemoryPrincipalRepresentationReader__Factory>;

  type Alarisa_Back_Control_Adapter_ScriptedModelClient = typeof import("./src/Adapter/ScriptedModelClient.mjs").default;
  type Alarisa_Back_Control_Adapter_ScriptedModelClient$ = InstanceType<Alarisa_Back_Control_Adapter_ScriptedModelClient>;
  type Alarisa_Back_Control_Adapter_ScriptedModelClient__Factory = typeof import("./src/Adapter/ScriptedModelClient.mjs").Factory;
  type Alarisa_Back_Control_Adapter_ScriptedModelClient__Factory$ = InstanceType<Alarisa_Back_Control_Adapter_ScriptedModelClient__Factory>;

  type Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient = typeof import("./src/Adapter/OpenAIResponsesModelClient.mjs").default;
  type Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient$ = InstanceType<Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient>;
  type Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient__Factory = typeof import("./src/Adapter/OpenAIResponsesModelClient.mjs").Factory;
  type Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient__Factory$ = InstanceType<Alarisa_Back_Control_Adapter_OpenAIResponsesModelClient__Factory>;

  type Alarisa_Back_Control_Config_OpenAiSmoke = import("./src/Config/OpenAiSmoke.mjs").Data;
  type Alarisa_Back_Control_Config_OpenAiSmoke$ = InstanceType<typeof import("./src/Config/OpenAiSmoke.mjs").default>;
  type Alarisa_Back_Control_Config_OpenAiSmoke__Factory = typeof import("./src/Config/OpenAiSmoke.mjs").Factory;
  type Alarisa_Back_Control_Config_OpenAiSmoke__Factory$ = InstanceType<Alarisa_Back_Control_Config_OpenAiSmoke__Factory>;

  type Alarisa_Back_Control_Plane = typeof import("./src/Plane.mjs").default;
  type Alarisa_Back_Control_Plane$ = InstanceType<Alarisa_Back_Control_Plane>;
  type Alarisa_Back_Control_Proposal = typeof import("./src/Proposal.mjs").default;
  type Alarisa_Back_Control_Proposal$ = InstanceType<Alarisa_Back_Control_Proposal>;
}

export {};
