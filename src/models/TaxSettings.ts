import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const TaxSettings = createPrismaModelAdapter("taxSettings", {
  vatRate: 20,
});

export default TaxSettings;
