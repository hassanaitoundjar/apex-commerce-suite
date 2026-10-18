"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";

interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  colors?: string[];
  ratings?: number;
  reviewsCount?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
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
}

export default function BestSellersSection({
  products = [],
  categories = [],
  currency = "MAD",
  lang = "fr",
  productUrlFormat = "slug",
  title = "Meilleures ventes de la semaine",
}: BestSellersSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
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

  // Prioritize top categories matching the reference storefront layout
  const priorityOrder = ["chaises", "tables", "canapes", "canapés", "fauteuils", "lits"];
  const sortedCategories = [...categories].sort((a, b) => {
    const aSlug = (a.slug || "").toLowerCase();
    const bSlug = (b.slug || "").toLowerCase();
    const aIdx = priorityOrder.indexOf(aSlug);
    const bIdx = priorityOrder.indexOf(bSlug);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  // Top 5 category tabs, remainder in "Voir plus"
  const topTabs = sortedCategories.slice(0, 5);
  const moreTabs = sortedCategories.slice(5);

  // Filter products by tab
  const filteredProducts = activeTab === "all"
    ? products
    : products.filter((p) => {
        const prodCat = (p.category || "").toLowerCase();
        const target = activeTab.toLowerCase();
        return prodCat === target || prodCat.includes(target) || target.includes(prodCat);
      });

  const getColorHex = (c: string) => {
    if (c.startsWith("#") || c.startsWith("rgb")) return c;
    const map: Record<string, string> = {
      grey: "#9ca3af",
      gray: "#9ca3af",
      black: "#1f2937",
      white: "#f3f4f6",
      cream: "#f5f0eb",
      brown: "#78350f",
      wood: "#8b5a2b",
      navy: "#1e3a8a",
      blue: "#2563eb",
      green: "#15803d",
      red: "#b91c1c",
    };
    return map[c.toLowerCase()] || c;
  };

  return (
    <section className="best-sellers-section">
      <div className="container">
        {/* Section Header with Title & Filter Tabs */}
        <div className="best-sellers-header">
          <h2 className="best-sellers-title">{title}</h2>

          <div className="best-sellers-tabs">
            {/* "Tous" tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setDropdownOpen(false);
              }}
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            >
              Tous
            </button>

            {/* Top Categories */}
            {topTabs.map((cat) => {
              const isActive = activeTab.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat.slug);
                    setDropdownOpen(false);
                  }}
                  className={`tab-btn ${isActive ? "active" : ""}`}
                >
                  {cat.name}
                </button>
              );
            })}

            {/* "Voir plus" Dropdown */}
            {moreTabs.length > 0 && (
              <div className="tab-dropdown-wrap" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`tab-btn dropdown-toggle ${
                    moreTabs.some((c) => c.slug.toLowerCase() === activeTab.toLowerCase())
                      ? "active"
                      : ""
                  }`}
                >
                  <span>
                    {moreTabs.find((c) => c.slug.toLowerCase() === activeTab.toLowerCase())
                      ?.name || "Voir plus"}
                  </span>
                  <ChevronDown size={14} style={{ marginLeft: 4 }} />
                </button>

                {dropdownOpen && (
                  <div className="tab-dropdown-menu">
                    {moreTabs.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => {
                          setActiveTab(cat.slug);
                          setDropdownOpen(false);
                        }}
                        className={`dropdown-item ${
                          activeTab.toLowerCase() === cat.slug.toLowerCase() ? "selected" : ""
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 5-Column Responsive Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-products-state">
            <p>Aucun produit trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <div className="best-sellers-grid">
            {filteredProducts.map((product) => {
              const id = product._id || product.id || product.name;
              const isWishlisted = wishlistIds.includes(id);

              // Calculate discount % if available
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

              // Badges
              const isNew = product.brand === "Avana" || product.brand === "Aruda" || (product.name.toLowerCase().includes("cocktail") || product.name.toLowerCase().includes("avana"));
              const isPopular = (product.ratings && product.ratings >= 4.9) || (product.reviewsCount && product.reviewsCount >= 20) || product.name.toLowerCase().includes("kensington");

              // Colors
              const colorsList = product.colors && product.colors.length > 0
                ? product.colors
                : ["#9ca3af", "#1f2937"];

              return (
                <div key={id} className="bs-card">
                  {/* Top-Left Stacked Badges */}
                  <div className="bs-badges-wrap">
                    {isNew && (
                      <span className="bs-badge bs-badge-new">NOUVEAU</span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bs-badge bs-badge-discount">-{discountPercent}%</span>
                    )}
                    {isPopular && (
                      <span className="bs-badge bs-badge-popular">POPULAIRE</span>
                    )}
                  </div>

                  {/* Top-Right Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className={`bs-wishlist-btn ${isWishlisted ? "active" : ""}`}
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? "#ef4444" : "none"}
                      stroke={isWishlisted ? "#ef4444" : "#64748b"}
                      strokeWidth={1.8}
                    />
                  </button>

                  {/* Centered Image Card */}
                  <Link href={getProductLink(product)} className="bs-img-link">
                    <div className="bs-img-container">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                        alt={product.name}
                        className="bs-product-img"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="bs-info">
                    <Link href={getProductLink(product)} className="bs-title-link">
                      <h3 className="bs-title" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>

                    <span className="bs-category">{product.category}</span>

                    {/* Bottom Row: Price & Color Swatches */}
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

                      {/* Color dots */}
                      <div className="bs-colors-wrap">
                        {colorsList.slice(0, 3).map((col, idx) => (
                          <span
                            key={idx}
                            className="bs-color-dot"
                            style={{ backgroundColor: getColorHex(col) }}
                            title={col}
                          />
                        ))}
                      </div>
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
          padding: 60px 0 80px;
          background-color: #faf9f6;
        }

        .best-sellers-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .best-sellers-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .best-sellers-tabs {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .tab-btn {
          background: none;
          border: none;
          font-size: 14.5px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          padding: 4px 0 6px 0;
          position: relative;
          transition: color 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: #111827;
        }

        .tab-btn.active {
          color: #111827;
          font-weight: 700;
          border-bottom: 2px solid #111827;
        }

        .tab-dropdown-wrap {
          position: relative;
        }

        .dropdown-toggle {
          display: inline-flex;
          align-items: center;
        }

        .tab-dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          z-index: 50;
          min-width: 160px;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 8px 16px;
          font-size: 13.5px;
          color: #374151;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .dropdown-item:hover {
          background-color: #f1f5f9;
          color: #111827;
        }

        .dropdown-item.selected {
          font-weight: 700;
          color: #6366f1;
        }

        /* 5-Column Grid */
        .best-sellers-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 22px;
        }

        @media (max-width: 1280px) {
          .best-sellers-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 960px) {
          .best-sellers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }
          .best-sellers-title {
            font-size: 26px;
          }
        }

        @media (max-width: 640px) {
          .best-sellers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          .best-sellers-tabs {
            gap: 14px;
            font-size: 13.5px;
          }
          .best-sellers-title {
            font-size: 22px;
          }
        }

        /* Individual Card */
        .bs-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
          padding: 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bs-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
        }

        /* Badges */
        .bs-badges-wrap {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 2;
        }

        .bs-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          color: #ffffff;
          border-radius: 20px;
          padding: 3px 8px;
          text-align: center;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .bs-badge-new {
          background-color: #2e7d32;
        }

        .bs-badge-discount {
          background-color: #c2410c;
          font-size: 10.5px;
        }

        .bs-badge-popular {
          background-color: #991b1b;
        }

        /* Wishlist Heart Button */
        .bs-wishlist-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: transform 0.2s ease, background 0.2s ease;
          padding: 0;
        }

        .bs-wishlist-btn:hover {
          transform: scale(1.1);
          background: #ffffff;
        }

        /* Image link & container */
        .bs-img-link {
          text-decoration: none;
          display: block;
        }

        .bs-img-container {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 12px;
          background: #ffffff;
        }

        .bs-product-img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bs-card:hover .bs-product-img {
          transform: scale(1.06);
        }

        /* Info block */
        .bs-info {
          display: flex;
          flex-direction: column;
          margin-top: auto;
        }

        .bs-title-link {
          text-decoration: none;
        }

        .bs-title {
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 3px 0;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bs-title:hover {
          color: #6366f1;
        }

        .bs-category {
          font-size: 12px;
          color: #9ca3af;
          margin: 0 0 10px 0;
          text-transform: capitalize;
          font-weight: 400;
        }

        /* Bottom Row */
        .bs-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: auto;
        }

        .bs-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .bs-old-price {
          font-size: 11px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 400;
        }

        .bs-current-price {
          font-size: 14.5px;
          font-weight: 800;
          color: #111827;
        }

        /* Color Dots */
        .bs-colors-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .bs-color-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.15);
          display: inline-block;
          flex-shrink: 0;
        }

        .empty-products-state {
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
        }
      `}</style>
    </section>
  );
}
