import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Bundle = createPrismaModelAdapter("bundle", {
  itemsCount: 2,
  status: "Active",
  price: 0,
});

export default Bundle;
