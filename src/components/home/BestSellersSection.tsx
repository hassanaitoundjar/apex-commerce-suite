"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, ChevronDown, Star, ShoppingBag, Eye, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

export interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  colors?: string[];
  sizes?: string[];
  ratings?: number;
  reviewsCount?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isAvailable?: boolean;
  createdAt?: string;
  brand?: string;
}

interface BestSellersSectionProps {
  products: ProductItem[];
  categories: { name: string; slug: string }[];
  currency?: string;
  lang: string;
  productUrlFormat?: string;
  title?: string;
  subtitle?: string;
}

export default function BestSellersSection({
  products = [],
  categories = [],
  currency = "MAD",
  lang = "fr",
  productUrlFormat = "slug",
  title = "Meilleures Ventes de la Semaine",
  subtitle = "Les pièces les plus plébiscitées par notre communauté pour homme et femme",
}: BestSellersSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useApp ? useApp() : { addToCart: () => {} };

  // Sync wishlist from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed.map((item: any) => item._id || item.id));
        }
      }
    } catch {}

    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("wishlist");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setWishlistIds(parsed.map((item: any) => item._id || item.id));
          }
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleWishlist = (e: React.MouseEvent, product: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();

    const id = product._id || product.id || product.name;
    try {
      let list: any[] = [];
      const stored = localStorage.getItem("wishlist");
      if (stored) list = JSON.parse(stored);

      const exists = list.some((item) => (item._id || item.id) === id);
      if (exists) {
        list = list.filter((item) => (item._id || item.id) !== id);
        setWishlistIds(list.map((item) => item._id || item.id));
      } else {
        list.push(product);
        setWishlistIds((prev) => [...prev, id]);
      }
      localStorage.setItem("wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  const getProductLink = (p: ProductItem) => {
    if (productUrlFormat !== "id") {
      const slug = (p.name || "")
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
    return `/${lang}/product/${p._id || p.id}`;
  };

  const formatPrice = (amount: number) => {
    return (
      amount.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " " + currency
    );
  };

  // Women-related slugs / keywords
  const isWomenProduct = (p: ProductItem) => {
    const cat = (p.category || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return (
      cat === "women" ||
      cat === "dresses" ||
      name.includes("robe") ||
      name.includes("femme") ||
      name.includes("palazzio") ||
      name.includes("sac")
    );
  };

  // Men-related slugs / keywords
  const isMenProduct = (p: ProductItem) => {
    const cat = (p.category || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    return (
      cat === "men" ||
      cat === "suits" ||
      cat === "hoodies" ||
      name.includes("homme") ||
      name.includes("costume") ||
      name.includes("manteau") ||
      name.includes("blouson") ||
      name.includes("oxford") ||
      name.includes("selvedge")
    );
  };

  // Filter products by active tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "women") return isWomenProduct(p);
    if (activeTab === "men") return isMenProduct(p);
    if (activeTab === "sale") return p.isOnSale;

    const prodCat = (p.category || "").toLowerCase();
    const target = activeTab.toLowerCase();
    return prodCat === target || prodCat.includes(target) || target.includes(prodCat);
  });

  // Category Tabs Configuration
  const tabs = [
    { id: "all", label: "Tous" },
    { id: "women", label: "Femmes" },
    { id: "men", label: "Hommes" },
    { id: "jackets", label: "Vestes & Manteaux" },
    { id: "dresses", label: "Robes" },
    { id: "shoes", label: "Chaussures" },
    { id: "sale", label: "Promotions" },
  ];

  return (
    <section className="best-sellers-section">
      <div className="container">
        {/* Header & Tabs */}
        <div className="best-sellers-header">
          <div className="header-text-block">
            <span className="section-eyebrow">TENDANCES & SÉLECTIONS</span>
            <h2 className="best-sellers-title">{title}</h2>
            <p className="best-sellers-subtitle">{subtitle}</p>
          </div>

          <div className="best-sellers-tabs-wrapper">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${isActive ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4/5-Column Responsive Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-products-state">
            <p>Aucun article trouvé dans cette sélection.</p>
          </div>
        ) : (
          <div className="best-sellers-grid">
            {filteredProducts.map((product) => {
              const id = product._id || product.id || product.name;
              const isWishlisted = wishlistIds.includes(id);

              // Discount calculation
              let discountPercent = 0;
              let originalPrice = product.price;
              let currentPrice = product.price;

              if (product.isOnSale && product.salePrice && product.salePrice < product.price) {
                originalPrice = product.price;
                currentPrice = product.salePrice;
                discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
              } else if (product.salePrice && product.salePrice > product.price) {
                originalPrice = product.salePrice;
                currentPrice = product.price;
                discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
              }

              const isBestSeller = (product.ratings && product.ratings >= 4.8) || (product.reviewsCount && product.reviewsCount >= 25);
              const isNew = product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

              return (
                <div key={id} className="bs-card">
                  {/* Badges container */}
                  <div className="bs-badges-wrap">
                    {discountPercent > 0 && (
                      <span className="bs-badge bs-badge-discount">-{discountPercent}%</span>
                    )}
                    {isBestSeller && (
                      <span className="bs-badge bs-badge-popular">BEST SELLER</span>
                    )}
                    {isNew && !isBestSeller && (
                      <span className="bs-badge bs-badge-new">NOUVEAU</span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className={`bs-wishlist-btn ${isWishlisted ? "active" : ""}`}
                    aria-label="Ajouter aux favoris"
                    title="Ajouter aux favoris"
                  >
                    <Heart
                      size={17}
                      fill={isWishlisted ? "#ef4444" : "none"}
                      stroke={isWishlisted ? "#ef4444" : "#475569"}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Image Link with Dual Hover if multiple images */}
                  <Link href={getProductLink(product)} className="bs-img-link">
                    <div className="bs-img-container">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                        alt={product.name}
                        className="bs-product-img primary-img"
                        loading="lazy"
                      />
                      {product.images && product.images.length > 1 && (
                        <img
                          src={product.images[1]}
                          alt={`${product.name} vue 2`}
                          className="bs-product-img secondary-img"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="bs-info">
                    {/* Brand & Category */}
                    <div className="bs-meta-row">
                      <span className="bs-brand">{product.brand || "SnapShop"}</span>
                      <span className="bs-category">{product.category}</span>
                    </div>

                    {/* Title */}
                    <Link href={getProductLink(product)} className="bs-title-link">
                      <h3 className="bs-title" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating Stars */}
                    <div className="bs-rating-row">
                      <div className="stars-box">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < Math.floor(product.ratings || 5) ? "#fbbf24" : "none"}
                            stroke="#fbbf24"
                          />
                        ))}
                      </div>
                      <span className="reviews-count">({product.reviewsCount || 12})</span>
                    </div>

                    {/* Price & Action Row */}
                    <div className="bs-bottom-row">
                      <div className="bs-price-wrap">
                        {discountPercent > 0 && (
                          <span className="bs-old-price">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                        <span className="bs-current-price">
                          {formatPrice(currentPrice)}
                        </span>
                      </div>

                      {/* Quick Add / View Icon */}
                      <Link
                        href={getProductLink(product)}
                        className="bs-quick-btn"
                        title="Voir le produit"
                      >
                        <Eye size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .best-sellers-section {
          padding: 68px 0 88px;
          background-color: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .best-sellers-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 38px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-text-block {
          max-width: 500px;
        }

        .section-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 1px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .best-sellers-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
          line-height: 1.2;
        }

        .best-sellers-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        .best-sellers-tabs-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          background: #f8fafc;
          padding: 6px;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
        }

        .tab-btn {
          background: transparent;
          border: none;
          font-size: 13.5px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          padding: 7px 16px;
          border-radius: 9999px;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          color: #0f172a;
        }

        .tab-btn.active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
        }

        /* 4-column modern fashion grid */
        .best-sellers-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
        }

        @media (max-width: 1200px) {
          .best-sellers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 22px;
          }
        }

        @media (max-width: 840px) {
          .best-sellers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .best-sellers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
        }

        /* Individual Card */
        .bs-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bs-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1);
        }

        /* Badges */
        .bs-badges-wrap {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 3;
          pointer-events: none;
        }

        .bs-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          color: #ffffff;
          border-radius: 6px;
          padding: 3px 8px;
          text-align: center;
          letter-spacing: 0.5px;
        }

        .bs-badge-discount {
          background-color: #dc2626;
        }

        .bs-badge-popular {
          background-color: #0f172a;
          color: #fcd34d;
        }

        .bs-badge-new {
          background-color: #15803d;
        }

        /* Wishlist Heart Button */
        .bs-wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 4;
          transition: transform 0.2s ease, background 0.2s ease;
          padding: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .bs-wishlist-btn:hover {
          transform: scale(1.12);
          background: #ffffff;
        }

        /* Image link & container */
        .bs-img-link {
          text-decoration: none;
          display: block;
          overflow: hidden;
          background-color: #f8fafc;
        }

        .bs-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
        }

        .bs-product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }

        .primary-img {
          opacity: 1;
        }

        .secondary-img {
          position: absolute;
          inset: 0;
          opacity: 0;
        }

        .bs-card:hover .primary-img {
          transform: scale(1.06);
        }

        .bs-card:hover .secondary-img {
          opacity: 1;
          transform: scale(1.06);
        }

        /* Product Details Info */
        .bs-info {
          padding: 16px 16px 18px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .bs-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 6px;
        }

        .bs-brand {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #c2410c;
        }

        .bs-category {
          color: #94a3b8;
          text-transform: capitalize;
        }

        .bs-title-link {
          text-decoration: none;
          color: inherit;
        }

        .bs-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
          line-height: 1.35;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: color 0.2s ease;
        }

        .bs-title:hover {
          color: #c2410c;
        }

        .bs-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .stars-box {
          display: flex;
          gap: 2px;
        }

        .reviews-count {
          font-size: 11px;
          color: #94a3b8;
        }

        .bs-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .bs-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .bs-current-price {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.2px;
        }

        .bs-old-price {
          font-size: 13px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }

        .bs-quick-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .bs-quick-btn:hover {
          background: #0f172a;
          color: #ffffff;
          transform: scale(1.08);
        }

        .empty-products-state {
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px dashed #cbd5e1;
        }

        @media (max-width: 640px) {
          .best-sellers-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .best-sellers-tabs-wrapper {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            justify-content: flex-start;
            padding: 4px;
          }
          .tab-btn {
            white-space: nowrap;
            padding: 6px 12px;
            font-size: 12.5px;
          }
          .bs-title {
            font-size: 13px;
            height: 34px;
          }
          .bs-current-price {
            font-size: 14px;
          }
          .bs-info {
            padding: 10px 10px 12px;
          }
        }
      `}</style>
    </section>
  );
}
