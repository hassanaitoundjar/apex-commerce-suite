import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Size = createPrismaModelAdapter("size", {});

export default Size;
