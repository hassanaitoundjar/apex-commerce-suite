import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const CurrencySettings = createPrismaModelAdapter("currencySettings", {
  currency: "$",
  currencyPos: "before",
});

export default CurrencySettings;
