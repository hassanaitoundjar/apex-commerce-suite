import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const PaymentSettings = createPrismaModelAdapter("paymentSettings", {
  enableCod: true,
  enableStripe: true,
  stripeMode: "sandbox",
  stripePubKey: "pk_test_mock_keys_12345",
  stripeSecretKey: "sk_test_mock_keys_54321",
  enableRazorpay: false,
  razorpayMode: "sandbox",
  razorpayKeyId: "rzp_test_mock_keys_123",
  razorpayKeySecret: "rzp_sec_mock_keys_456",
  enablePaypal: false,
  paypalMode: "sandbox",
  paypalClientId: "paypal_client_mock_123",
  paypalClientSecret: "paypal_secret_mock_456",
  codLogo: "",
  stripeLogo: "",
  razorpayLogo: "",
  paypalLogo: "",
});

export default PaymentSettings;
