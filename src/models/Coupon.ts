import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Coupon = createPrismaModelAdapter("coupon", {
  discountType: "percentage",
  isActive: true,
});

export default Coupon;
