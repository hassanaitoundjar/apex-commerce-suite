import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Category = createPrismaModelAdapter("category", {});

export default Category;
