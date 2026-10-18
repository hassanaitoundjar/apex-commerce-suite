import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Brand = createPrismaModelAdapter("brand", {
  active: true,
});

export default Brand;
