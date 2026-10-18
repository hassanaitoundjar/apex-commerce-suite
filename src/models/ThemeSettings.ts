import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const ThemeSettings = createPrismaModelAdapter("themeSettings", {
  selectedTheme: "light",
  primaryColor: "#d31e28",
});

export default ThemeSettings;
