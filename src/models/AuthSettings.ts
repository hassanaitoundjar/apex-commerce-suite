import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const AuthSettings = createPrismaModelAdapter("authSettings", {
  enableEmail: true,
  enablePhone: false,
  enableGoogle: false,
  enableFacebook: false,
  enableApple: false,
  firebaseConfig: "",
});

export default AuthSettings;
