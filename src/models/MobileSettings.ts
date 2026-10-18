import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const MobileSettings = createPrismaModelAdapter("mobileSettings", {
  mobileAppName: "SnapShop",
  webViewUrl: "http://10.0.2.2:3000",
  privacyPolicyLink: "domain.com",
  termsOfServiceLink: "domain.com",
  rateUsLink: "domain.com",
  forceUpdate: false,
  updateLink: "domain.com",
  targetVersionCode: 1,
  enableGooglePlay: true,
  apiBaseUrl: "localhost/api/mobile/v1",
  apiAccessKey: "snap_ak_jq1gdg3frymuzt5z",
  adsProvider: "Google AdMob",
  admobAppId: "ca-app-pub-3940256099942544~3347511713",
  bannerAdEnabled: true,
  bannerAdUnitId: "ca-app-pub-3940256099942544/6300978111",
  interstitialAdEnabled: false,
  interstitialAdUnitId: "ca-app-pub-3940256099942544/1033173712",
  rewardedAdEnabled: true,
  rewardedAdUnitId: "ca-app-pub-3940256099942544/5224354917",
});

export default MobileSettings;
