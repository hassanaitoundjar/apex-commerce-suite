import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const GeneralSettings = createPrismaModelAdapter("generalSettings", {
  storeName: "SnapShop",
  storeEmail: "contact@snapshop.com",
  websiteLink: "snapshop.gadohost.com",
  logoUrl: "",
  faviconUrl: "",
  currency: "$",
  shippingCost: 0,
  promoCode: "WELCOME10",
  promoDiscount: 10,
  heroTitle: "Discover Your Style",
  heroSubtitle: "Explore our latest collection of premium fashion designed for the modern woman.",
  heroImageUrl: "/hero_fashion_girl.jpg",
  storeCountry: "Morocco",
  activeZones: ["Worldwide"],
  shippingPolicy: "We offer fast and reliable shipping to all locations. Orders are typically processed within 1-2 business days and delivered within 3-5 business days.",
  returnsPolicy: "We offer a 30-day return policy. Items must be unworn, unwashed, and in original packaging with tags attached.",
  sizeGuideContent: "How to Measure:\n- Bust/Chest: Measure around the fullest part of your bust, keeping the tape level.\n- Waist: Measure around your natural waistline, which is the narrowest part of your waist.\n- Hips: Measure around the fullest part of your hips, approximately 7-8 inches below your waist.",
  productUrlFormat: "slug",
  footerAbout: "Explore our latest collection of premium fashion designed for the modern woman.",
  footerEmail: "support@snapshop.com",
  footerPhone: "+1 (234) 567-890",
  footerAddress: "123 Fashion Blvd, NY",
  footerCopyright: "SnapShop. All rights reserved.",
});

export default GeneralSettings;
