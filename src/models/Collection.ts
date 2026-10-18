import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Collection = createPrismaModelAdapter("collection", {
  active: true,
});

export default Collection;
