import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const AiSettings = createPrismaModelAdapter("aiSettings", {
  activeProvider: "gemini",
  openaiKey: "",
  groqKey: "",
  geminiKey: "",
});

export default AiSettings;
