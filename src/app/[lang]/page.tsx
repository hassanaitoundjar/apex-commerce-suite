export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getSettings } from "@/lib/settings";
import Countdown from "@/components/Countdown";
import { Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import CategoryListSection from "@/components/home/CategoryListSection";
import BestSellersSection from "@/components/home/BestSellersSection";

import Translation from "@/models/Translation";

async function getHomeData() {
  try {
    await dbConnect();
    const settings = await getSettings();

    const featuredProducts = await Product.find({ isFeatured: true, isAvailable: true }).limit(8);
    const popularProducts = await Product.find({ isAvailable: true }).sort({ ratings: -1, reviewsCount: -1 }).limit(8);
    const newArrivals = await Product.find({ isAvailable: true }).sort({ createdAt: -1 }).limit(8);
    const categoriesRaw = await Category.find({});

    const categories = [];
    for (const cat of categoriesRaw) {
      const catObj = typeof cat.toObject === "function" ? cat.toObject() : cat;
      const latestProduct = await Product.findOne({
        category: { $regex: new RegExp(`^${catObj.slug}$`, "i") },
        isAvailable: true
      }).sort({ createdAt: -1 });

      const img = catObj.image || (latestProduct?.images && latestProduct.images.length > 0 ? latestProduct.images[0] : "/placeholder.png");

      categories.push({
        ...catObj,
        imageUrl: img,
      });
    }

    const allCatalogProducts = await Product.find({ isAvailable: true }).sort({ ratings: -1, createdAt: -1 }).limit(40);

    return {
      settings: JSON.parse(JSON.stringify(settings)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      popularProducts: JSON.parse(JSON.stringify(popularProducts)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      allCatalogProducts: JSON.parse(JSON.stringify(allCatalogProducts)),
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (e) {
    console.error("Failed to load home data:", e);
    return {
      settings: {
        heroTitle: "Discover Your Style",
        heroSubtitle: "Explore our latest collection of premium fashion designed for the modern woman.",
        heroImageUrl: "/hero_fashion_girl.jpg",
        heroCountdownDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
        currency: "$",
      },
      featuredProducts: [],
      popularProducts: [],
      newArrivals: [],
      allCatalogProducts: [],
      categories: [],
    };
  }
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { settings, featuredProducts, popularProducts, newArrivals, allCatalogProducts = [], categories } = await getHomeData();

  // Load translations matching current locale
  const translationsRaw = await Translation.find({});
  const t = (key: string): string => {
    const item = translationsRaw.find((item: any) => item.key === key);
    if (!item) return key;
    let val = "";
    if (typeof item.translations?.get === "function") {
      val = item.translations.get(lang);
    } else if (item.translations) {
      val = item.translations[lang];
    }
    return val || item.translations?.get?.("en") || item.translations?.["en"] || key;
  };

  const getProductLink = (p: any) => {
    if (settings.productUrlFormat !== "id") {
      const slug = p.name
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      return `/${lang}/product/${slug}`;
    }
    return `/${lang}/product/${p._id}`;
  };

  const allProducts = [...featuredProducts, ...popularProducts, ...newArrivals];

  const renderProductCard = (product: any) => {
    const isBestSeller = product.ratings >= 4.5 && product.reviewsCount >= 3;
    const isSale = product.isOnSale;

    return (
      <Link href={getProductLink(product)} key={product._id} className="prod-card">
        <div className="prod-img-container">
          <img
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            className="prod-img"
          />
          {isSale && (
            <span className="badge-custom badge-sale">{t("Sale") || "SALE"}</span>
          )}
          {!isSale && isBestSeller && (
            <span className="badge-custom badge-best">{t("Best Seller") || "BEST SELLER"}</span>
          )}
        </div>
        <div className="prod-details">
          <span className="prod-category">{t(product.category)}</span>
          <h3 className="prod-title">{product.name}</h3>

          <div className="rating-row">
            <div className="rating-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(product.ratings) ? "#fbbf24" : "none"}
                  stroke="#fbbf24"
                />
              ))}
            </div>
            <span className="rating-count">({product.reviewsCount} {t("reviews")})</span>
          </div>

          <div className="price-row-custom">
            <span className="price-current">
              {settings.currency}{product.price.toFixed(2)}
            </span>
            {product.isOnSale && product.salePrice && (
              <span className="price-old">
                {settings.currency}{product.salePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <main style={styles.main}>
      <style>{`
        .custom-section {
          padding: 60px 0;
        }
        .custom-section-bg {
          background-color: #fcfcfd;
          border-top: 1px solid #f2f2f7;
          border-bottom: 1px solid #f2f2f7;
        }
        .section-title-wrap {
          text-align: center;
          margin-bottom: 40px;
        }
        .section-title-custom {
          font-family: 'Outfit', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #111111;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .section-subtitle-custom {
          font-size: 15px;
          color: #666666;
          max-width: 600px;
          margin: 0 auto;
        }
        
        /* Product Cards */
        .product-grid-custom {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 30px;
        }
        @media (max-width: 640px) {
          .product-grid-custom {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .prod-card {
            border-radius: 12px !important;
          }
          .prod-details {
            padding: 12px 10px !important;
          }
          .prod-img-container {
            height: 180px !important;
          }
          .prod-title {
            font-size: 13px !important;
            line-height: 1.3 !important;
            height: 34px !important;
            margin-bottom: 6px !important;
          }
          .rating-row {
            flex-wrap: wrap !important;
            gap: 2px !important;
            margin-bottom: 8px !important;
          }
          .rating-count {
            font-size: 10px !important;
          }
          .price-current {
            font-size: 15px !important;
          }
          .price-old {
            font-size: 12px !important;
          }
          .badge-custom {
            top: 8px !important;
            left: 8px !important;
            font-size: 9px !important;
            padding: 3px 8px !important;
          }
        }
        @media (max-width: 360px) {
          .product-grid-custom {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .prod-img-container {
            height: 220px !important;
          }
        }

        /* Hero Mobile Responsive Rules */
        .hero-banner-section {
          width: 100%;
          max-width: 100vw;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .hero-banner-section {
            padding: 36px 0 !important;
          }
          .hero-container-wrap {
            gap: 28px !important;
            flex-direction: column !important;
          }
          .hero-left-box {
            flex: 1 1 100% !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-title-text {
            font-size: clamp(28px, 7.5vw, 40px) !important;
            line-height: 1.15 !important;
            margin-bottom: 14px !important;
            word-break: break-word !important;
          }
          .hero-subtitle-text {
            font-size: 14px !important;
            line-height: 1.5 !important;
            margin-bottom: 20px !important;
            max-width: 100% !important;
          }
          .hero-btn-group {
            flex-direction: column !important;
            gap: 10px !important;
            margin-top: 24px !important;
            width: 100% !important;
          }
          .hero-btn-action {
            width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
            padding: 14px 20px !important;
            font-size: 13px !important;
          }
          .hero-right-box {
            flex: 1 1 100% !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .hero-img-frame {
            height: 260px !important;
            max-width: 100% !important;
            border-radius: 16px !important;
          }
        }

        @media (max-width: 640px) {
          .trust-grid-custom {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>

      {/* Red Hero Banner Section */}
      <section className="hero-banner-section" style={styles.hero}>
        <div className="container hero-container-wrap" style={styles.heroContainer}>
          <div className="hero-left-box" style={styles.heroLeft}>
            <span style={styles.offerLabel}>{t("Limited Time Offer")}</span>
            <h1 className="hero-title-text" style={styles.heroTitle}>{t(settings.heroTitle)}</h1>
            <p className="hero-subtitle-text" style={styles.heroSubtitle}>{t(settings.heroSubtitle)}</p>

            {/* Flash Sale Countdown */}
            <Countdown targetDate={settings.heroCountdownDate} />

            <div className="hero-btn-group" style={styles.btnGroup}>
              <Link href={`/${lang}/shop`} className="btn btn-secondary hero-btn-action" style={styles.heroBtnWhite}>
                {t("SHOP COLLECTION")}
              </Link>
              <Link href={`/${lang}/shop?filter=sale`} className="btn btn-primary hero-btn-action" style={styles.heroBtnRed}>
                {t("SHOP FLASH SALE")}
              </Link>
            </div>
          </div>
          <div className="hero-right-box" style={styles.heroRight}>
            <div className="hero-img-frame" style={styles.imageFrame}>
              <img
                src={settings.heroImageUrl || "/hero_fashion_girl.jpg"}
                alt="SnapShop Luxury Fashion Model"
                style={styles.heroImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 1. Nos Catégories Section */}
      <CategoryListSection
        categories={categories.map((cat: any) => ({
          id: cat._id || cat.id,
          name: t(cat.name),
          slug: cat.slug,
          image: cat.image || cat.imageUrl,
        }))}
        lang={lang}
        title={t("Nos catégories")}
        subtitle={t("Explorez nos nouveautés et collections exclusives")}
        seeMoreText={t("Voir Plus")}
        seeLessText={t("Voir Moins")}
      />

      {/* Featured Collection Section (Weekly Best Sellers Design) */}
      <BestSellersSection
        products={allCatalogProducts.length > 0 ? allCatalogProducts : featuredProducts}
        categories={categories}
        currency={settings.currency || "MAD"}
        lang={lang}
        productUrlFormat={settings.productUrlFormat}
        title={t("Meilleures ventes de la semaine")}
        actionText={t("Choisir les options") || "Choisir les options"}
      />

      {/* 3. Popular This Week Section */}
      <section className="custom-section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title-custom">{t("Popular This Week")}</h2>
            <p className="section-subtitle-custom">{t("Top trending styles loved by our customers this week")}</p>
          </div>

          {popularProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <p>{t("No products found.")}</p>
            </div>
          ) : (
            <div className="product-grid-custom">
              {popularProducts.map(renderProductCard)}
            </div>
          )}
        </div>
      </section>

      {/* 4. New Arrivals Section */}
      <section className="custom-section custom-section-bg">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-title-custom">{t("New Arrivals")}</h2>
            <p className="section-subtitle-custom">{t("Discover our latest additions and update your wardrobe")}</p>
          </div>

          {newArrivals.length === 0 ? (
            <div style={styles.emptyState}>
              <p>{t("No products found.")}</p>
            </div>
          ) : (
            <div className="product-grid-custom">
              {newArrivals.map(renderProductCard)}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section id="about" style={styles.trustSection}>
        <div className="container trust-grid-custom" style={styles.trustGrid}>
          <div style={styles.trustCard}>
            <div style={styles.trustIconContainer}>
              <Truck size={32} color="var(--primary)" />
            </div>
            <h4 style={styles.trustTitle}>{t("Free Shipping")}</h4>
            <p style={styles.trustText}>
              {t("On all orders above")} {settings.currency}150. {t("Delivery within 2-3 business days.")}
            </p>
          </div>
          <div style={styles.trustCard}>
            <div style={styles.trustIconContainer}>
              <ShieldCheck size={32} color="var(--primary)" />
            </div>
            <h4 style={styles.trustTitle}>{t("Secure Checkout")}</h4>
            <p style={styles.trustText}>
              {t("All transactions are encrypted and processed through trusted gateways.")}
            </p>
          </div>
          <div style={styles.trustCard}>
            <div style={styles.trustIconContainer}>
              <RotateCcw size={32} color="var(--primary)" />
            </div>
            <h4 style={styles.trustTitle}>{t("Easy Returns")}</h4>
            <p style={styles.trustText}>
              {t("We offer a 30-day return policy. Items must be unworn and in original packaging.")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "80vh",
    overflowX: "hidden",
  },
  hero: {
    background: "linear-gradient(135deg, #a8000b 0%, #d31e28 50%, #8b0008 100%)",
    padding: "clamp(40px, 8vw, 96px) 0",
    color: "#ffffff",
    overflow: "hidden",
    width: "100%",
    maxWidth: "100vw",
  },
  heroContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    gap: "40px",
    flexWrap: "wrap",
    width: "100%",
  },
  heroLeft: {
    flex: "1 1 420px",
    animation: "fadeIn 0.8s ease-out",
    minWidth: 0,
    maxWidth: "100%",
  },
  offerLabel: {
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: "14px",
    display: "block",
  },
  heroTitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "clamp(30px, 5.5vw, 60px)",
    fontWeight: "800",
    lineHeight: "1.12",
    letterSpacing: "-1px",
    color: "#ffffff",
    marginBottom: "18px",
    wordBreak: "break-word",
  },
  heroSubtitle: {
    fontSize: "clamp(14px, 2vw, 18px)",
    color: "rgba(255, 255, 255, 0.95)",
    maxWidth: "540px",
    marginBottom: "28px",
    lineHeight: "1.6",
  },
  btnGroup: {
    display: "flex",
    gap: "14px",
    marginTop: "32px",
    flexWrap: "wrap",
  },
  heroBtnWhite: {
    backgroundColor: "#ffffff",
    color: "#111111",
    border: "none",
    fontWeight: "700",
    padding: "14px 32px",
    borderRadius: "30px",
    letterSpacing: "0.5px",
    transition: "transform 0.2s ease",
  },
  heroBtnRed: {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "2px solid #ffffff",
    fontWeight: "700",
    padding: "12px 32px",
    borderRadius: "30px",
    letterSpacing: "0.5px",
    transition: "transform 0.2s ease",
  },
  heroRight: {
    flex: "1 1 320px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 0,
    maxWidth: "100%",
  },
  imageFrame: {
    width: "100%",
    maxWidth: "460px",
    height: "clamp(260px, 45vw, 500px)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.15)",
    position: "relative",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "16px",
  },
  viewAllLink: {
    color: "var(--primary)",
    fontWeight: "700",
    fontSize: "15px",
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  emptyState: {
    padding: "60px",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "16px",
    border: "1px dashed var(--border-color)",
  },
  trustSection: {
    backgroundColor: "#ffffff",
    padding: "clamp(48px, 6vw, 72px) 0",
    borderTop: "1px solid #f0f2f5",
  },
  trustGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
  },
  trustCard: {
    padding: "32px 24px",
    borderRadius: "16px",
    backgroundColor: "#fcfcfd",
    border: "1px solid #eef0f3",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.3s ease",
  },
  trustIconContainer: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "rgba(211, 30, 40, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  trustTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111111",
    marginBottom: "10px",
  },
  trustText: {
    fontSize: "14px",
    color: "#666666",
    lineHeight: "1.55",
  },
};
