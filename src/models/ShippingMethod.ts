import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const ShippingMethod = createPrismaModelAdapter("shippingMethod", {
  cost: 0,
  deliveryTime: "3-5 business days",
  isActive: true,
});

export default ShippingMethod;
