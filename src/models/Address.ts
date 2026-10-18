import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Address = createPrismaModelAdapter("address", {
  label: "Home",
  fullName: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
  isDefault: false,
});

export default Address;
