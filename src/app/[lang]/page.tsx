export const dynamic = "force-dynamic";

import React from "react";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getSettings } from "@/lib/settings";
import Translation from "@/models/Translation";

// Import dedicated luxury Women's Fashion components
import WomenAnnouncementBar from "@/components/home/WomenAnnouncementBar";
import WomenHero from "@/components/home/WomenHero";
import WomenCategorySlider from "@/components/home/WomenCategorySlider";
import WomenBestSellers from "@/components/home/WomenBestSellers";
import WomenFlashDeals from "@/components/home/WomenFlashDeals";
import WomenEditorialStory from "@/components/home/WomenEditorialStory";
import WomenNewArrivals from "@/components/home/WomenNewArrivals";
import WomenTrustBar from "@/components/home/WomenTrustBar";
import WomenInstagram from "@/components/home/WomenInstagram";
import WomenNewsletter from "@/components/home/WomenNewsletter";

async function getHomeData() {
  try {
    await dbConnect();
    const settings = await getSettings();

    // Query active women's fashion catalog from PostgreSQL / Prisma backend
    const featuredProducts = await Product.find({ isFeatured: true, isAvailable: true }).limit(16);
    const popularProducts = await Product.find({ isAvailable: true })
      .sort({ ratings: -1, reviewsCount: -1 })
      .limit(16);
    const newArrivals = await Product.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(12);
    const onSaleProducts = await Product.find({ isOnSale: true, isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(8);

    const categoriesRaw = await Category.find({});
    const categories = [];

    for (const cat of categoriesRaw) {
      const catObj = typeof cat.toObject === "function" ? cat.toObject() : cat;
      const latestProduct = await Product.findOne({
        category: { $regex: new RegExp(`^${catObj.slug}$`, "i") },
        isAvailable: true,
      }).sort({ createdAt: -1 });

      const img =
        catObj.image ||
        (latestProduct?.images && latestProduct.images.length > 0
          ? latestProduct.images[0]
          : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80");

      categories.push({
        ...catObj,
        imageUrl: img,
      });
    }

    return {
      settings: JSON.parse(JSON.stringify(settings)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      popularProducts: JSON.parse(JSON.stringify(popularProducts)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      onSaleProducts: JSON.parse(JSON.stringify(onSaleProducts)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (e) {
    console.error("Failed to load women fashion home data:", e);
    return {
      settings: {
        heroTitle: "L'Élégance Féminine Redéfinie",
        heroSubtitle:
          "Découvrez notre collection exclusive haute couture et prêt-à-porter : soies d'Italie, mailles en pur cachemire et maroquinerie d'exception.",
        heroImageUrl:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
        heroCountdownDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "MAD",
        promoCode: "WELCOME10",
        promoDiscount: 10,
        productUrlFormat: "slug",
      },
      featuredProducts: [],
      popularProducts: [],
      newArrivals: [],
      onSaleProducts: [],
      categories: [],
    };
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const {
    settings,
    featuredProducts,
    popularProducts,
    newArrivals,
    onSaleProducts,
    categories,
  } = await getHomeData();

  // Load translations matching current locale
  let translationsRaw: any[] = [];
  try {
    translationsRaw = await Translation.find({});
  } catch {}

  const t = (key: string): string => {
    const item = translationsRaw.find((i: any) => i.key === key);
    if (!item) return key;
    let val = "";
    if (typeof item.translations?.get === "function") {
      val = item.translations.get(lang);
    } else if (item.translations) {
      val = item.translations[lang];
    }
    return val || item.translations?.get?.("en") || item.translations?.["en"] || key;
  };

  // Combine unique products for best sellers / tab filtering
  const allProductsMap = new Map();
  [...featuredProducts, ...popularProducts, ...newArrivals, ...onSaleProducts].forEach((p) => {
    const id = p._id || p.id;
    if (id && !allProductsMap.has(id)) {
      allProductsMap.set(id, p);
    }
  });
  const allProducts = Array.from(allProductsMap.values());

  const heroCountdown =
    typeof settings?.heroCountdownDate === "string"
      ? settings.heroCountdownDate
      : settings?.heroCountdownDate?.toISOString?.() ||
        new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <main className="womens-luxury-fashion-home">
      {/* 1. Luxury Women Announcement & Coupon Bar */}
      <WomenAnnouncementBar
        promoCode={settings.promoCode || "WELCOME10"}
        promoDiscount={settings.promoDiscount || 10}
        currency={settings.currency || "MAD"}
      />

      {/* 2. Editorial Women's Fashion Hero with Ambient Orbs, Countdown & Live Card */}
      <WomenHero
        lang={lang}
        heroTitle={t(settings.heroTitle) || settings.heroTitle || "L'Élégance Féminine Redéfinie"}
        heroSubtitle={
          t(settings.heroSubtitle) ||
          settings.heroSubtitle ||
          "Découvrez notre collection exclusive haute couture et prêt-à-porter : soies d'Italie, mailles en pur cachemire et maroquinerie d'exception."
        }
        heroImageUrl={settings.heroImageUrl}
        countdownDate={heroCountdown}
        currency={settings.currency || "MAD"}
      />

      {/* 3. Circular Department Slider: Dresses, Coats, Knitwear, Bags, Shoes, Blazers */}
      {categories.length > 0 && (
        <WomenCategorySlider
          categories={categories}
          lang={lang}
        />
      )}

      {/* 4. Iconic Best Sellers with Interactive Category Filter Tabs */}
      <WomenBestSellers
        products={allProducts}
        currency={settings.currency || "MAD"}
        lang={lang}
        productUrlFormat={settings.productUrlFormat || "slug"}
        title={t("Les Pièces Iconiques") || "Les Pièces Iconiques"}
        subtitle={
          t("Nos créations les plus plébiscitées par notre communauté d'initiées") ||
          "Nos créations les plus plébiscitées par notre communauté d'initiées"
        }
      />

      {/* 5. Limited-Time Flash Deals with Real-Time Countdown */}
      {onSaleProducts.length > 0 && (
        <WomenFlashDeals
          products={onSaleProducts}
          lang={lang}
          currency={settings.currency || "MAD"}
          countdownDate={heroCountdown}
          productUrlFormat={settings.productUrlFormat || "slug"}
        />
      )}

      {/* 6. Editorial Story & Craftsmanship Lookbook */}
      <WomenEditorialStory lang={lang} />

      {/* 7. New Arrivals & Seasonal Drops */}
      {newArrivals.length > 0 && (
        <WomenNewArrivals
          products={newArrivals}
          lang={lang}
          currency={settings.currency || "MAD"}
          productUrlFormat={settings.productUrlFormat || "slug"}
        />
      )}

      {/* 8. Luxury Buyer Assurance & Trust Pillars */}
      <WomenTrustBar currency={settings.currency || "MAD"} />

      {/* 9. Shoppable Community Lookbook Feed */}
      <WomenInstagram lang={lang} />

      {/* 10. VIP Private Salon Newsletter & Privilege Club */}
      <WomenNewsletter
        promoCode={settings.promoCode || "WELCOME10"}
        promoDiscount={settings.promoDiscount || 10}
      />
    </main>
  );
}
