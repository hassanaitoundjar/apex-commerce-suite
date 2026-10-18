import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Order = createPrismaModelAdapter("order", {
  discountAmount: 0,
  orderStatus: "pending",
  paymentStatus: "unpaid",
  paymentMethod: "COD",
  isAdminSeen: false,
});

export default Order;
