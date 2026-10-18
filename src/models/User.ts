import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const User = createPrismaModelAdapter("user", {
  passwordSet: true,
  provider: "credentials",
  role: "customer",
  permissions: [],
  phone: "",
  bio: "",
  avatar: "",
  preferredCurrency: "USD",
  theme: "light",
  newsletter: true,
  orderUpdates: true,
});

export default User;
