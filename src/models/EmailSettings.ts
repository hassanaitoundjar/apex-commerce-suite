import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const EmailSettings = createPrismaModelAdapter("emailSettings", {
  mailMethod: "smtp",
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  fromEmail: "noreply@snapshop.com",
  fromName: "SnapShop",
  encryption: "tls",
  welcomeEmailTemplate: "",
  orderConfirmationTemplate: "",
  orderProcessingTemplate: "",
  orderShippedTemplate: "",
  orderDeliveredTemplate: "",
  orderCancelledTemplate: "",
  passwordResetTemplate: "",
});

export default EmailSettings;
