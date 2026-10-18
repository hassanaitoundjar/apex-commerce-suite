import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const CustomPage = createPrismaModelAdapter("customPage", {
  published: true,
});

export default CustomPage;
