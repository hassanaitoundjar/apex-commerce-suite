import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Color = createPrismaModelAdapter("color", {
  active: true,
});

export default Color;
