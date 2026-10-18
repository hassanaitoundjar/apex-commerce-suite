import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const LanguageSettings = createPrismaModelAdapter("languageSettings", {
  defaultLanguage: "en",
  languages: [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "/images/flags/us.svg",
      isActive: true,
      isDefault: true,
    },
  ],
});

export default LanguageSettings;
