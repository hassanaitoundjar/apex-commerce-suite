import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Translation = createPrismaModelAdapter("translation", {
  translations: {},
});

export default Translation;
