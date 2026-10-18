import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const ProductTemplate = createPrismaModelAdapter("productTemplate", {
  attributes: [],
  usage: 0,
});

export default ProductTemplate;
