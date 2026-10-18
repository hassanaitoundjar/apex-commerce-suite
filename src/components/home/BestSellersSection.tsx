"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

export interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  categoryId?: string;
  categoryIds?: string[];
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
  categories: { id?: string; _id?: string; name: string; slug: string }[];
  currency?: string;
  lang?: string;
  productUrlFormat?: string;
  title?: string;
  actionText?: string;
}

export default function BestSellersSection({
  products = [],
  categories: apiCategories = [],
  currency = "MAD",
  lang = "fr",
  productUrlFormat = "slug",
  title = "Meilleures ventes de la semaine",
  actionText = "Choisir les options",
}: BestSellersSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

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
    const formatted = amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${formatted} ${currency}`;
  };

  // Build categories list starting with 'Tous'
  const priorityOrder = ["chaises", "tables", "canapes", "canapés", "fauteuils", "lits"];
  const sortedCategories = [...apiCategories].sort((a, b) => {
    const aSlug = (a.slug || "").toLowerCase();
    const bSlug = (b.slug || "").toLowerCase();
    const aIdx = priorityOrder.indexOf(aSlug);
    const bIdx = priorityOrder.indexOf(bSlug);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const categoriesList = [
    { id: "all", label: "Tous", slug: "all" },
    ...sortedCategories.map((cat) => ({
      id: cat.slug || cat._id || cat.id || cat.name,
      label: cat.name,
      slug: cat.slug || cat.name,
    })),
  ];

  const visibleCategories = showAllCategories
    ? categoriesList
    : categoriesList.slice(0, 6);

  // Filter products by active category
  const filteredProducts = (activeCategory === "all"
    ? products
    : products.filter((p) => {
        const prodCat = (p.category || "").toLowerCase();
        const target = activeCategory.toLowerCase();
        return (
          prodCat === target ||
          prodCat.includes(target) ||
          target.includes(prodCat) ||
          p.categoryId === activeCategory ||
          (p.categoryIds && p.categoryIds.includes(activeCategory))
        );
      })
  ).slice(0, 10);

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

  const handleNextImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCardImageIndices((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current + 1) % totalImages };
    });
  };

  const handlePrevImage = (e: React.MouseEvent, productId: string, totalImages: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCardImageIndices((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: (current - 1 + totalImages) % totalImages };
    });
  };

  return (
    <section className="weekly-bestsellers">
      <div className="container">
        <div className="header-row">
          <h2 className="title">{title}</h2>
          <div className="filters">
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}

            {categoriesList.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="filter-btn see-more-link"
                style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                {showAllCategories ? "Voir moins" : "Voir plus"}
                {!showAllCategories ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>Aucun produit trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <div className="products-grid">
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

              // Badges from reference
              const isNew =
                product.brand === "Avana" ||
                product.brand === "Aruda" ||
                product.name.toLowerCase().includes("cocktail") ||
                product.name.toLowerCase().includes("avana") ||
                product.name.toLowerCase().includes("revolt");

              const isPopular =
                (product.ratings && product.ratings >= 4.8) ||
                (product.reviewsCount && product.reviewsCount >= 10) ||
                product.name.toLowerCase().includes("kensington") ||
                product.name.toLowerCase().includes("pivotant");

              // Colors list
              const colorsList =
                product.colors && product.colors.length > 0
                  ? product.colors
                  : ["#9ca3af", "#4b5563"];

              const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];
              const currentImgIdx = cardImageIndices[id] || 0;
              const activeImg = images[currentImgIdx % images.length];

              return (
                <div key={id} className="product-card-wrap">
                  {/* Badges Stacked Top-Left */}
                  <div className="card-badges">
                    {isNew && <span className="badge-pill badge-green">NOUVEAU</span>}
                    {discountPercent > 0 && <span className="badge-pill badge-orange">-{discountPercent}%</span>}
                    {isPopular && <span className="badge-pill badge-red">POPULAIRE</span>}
                  </div>

                  {/* Wishlist Heart Top-Right */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={17}
                      fill={isWishlisted ? "#ef4444" : "none"}
                      stroke={isWishlisted ? "#ef4444" : "#475569"}
                      strokeWidth={1.8}
                    />
                  </button>

                  {/* Image Container with Hover Arrows */}
                  <div className="card-img-box">
                    <Link href={getProductLink(product)} className="card-img-link">
                      <img
                        src={activeImg}
                        alt={product.name}
                        className="card-img"
                        loading="lazy"
                      />
                    </Link>

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="arrow-btn arrow-left"
                          onClick={(e) => handlePrevImage(e, id, images.length)}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          className="arrow-btn arrow-right"
                          onClick={(e) => handleNextImage(e, id, images.length)}
                          aria-label="Next image"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Details */}
                  <div className="card-details">
                    <Link href={getProductLink(product)} className="card-title-link">
                      <h3 className="card-title" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>

                    <span className="card-category">{product.category}</span>

                    <div className="card-bottom-row">
                      <div className="card-price-group">
                        {discountPercent > 0 && (
                          <span className="card-old-price">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                        <span className="card-current-price">
                          {formatPrice(currentPrice)}
                        </span>
                      </div>

                      {/* Color Swatch Dots */}
                      <div className="card-colors">
                        {colorsList.slice(0, 3).map((col, idx) => (
                          <span
                            key={idx}
                            className="color-dot"
                            style={{ backgroundColor: getColorHex(col) }}
                            title={col}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Button: Choisir les options */}
                    <div className="card-action-wrap">
                      <Link href={getProductLink(product)} className="card-action-btn">
                        {actionText}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .weekly-bestsellers {
          padding: 4.5rem 0 5.5rem;
          background-color: transparent;
        }

        .header-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 30px;
        }

        @media (min-width: 768px) {
          .header-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 32px;
          font-weight: 700;
          color: var(--dp-charcoal, #242424);
          margin: 0;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        @media (min-width: 1024px) {
          .title {
            font-size: 34px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 26px;
          }
        }

        .filters {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 1.25rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
          width: 100%;
        }
        .filters::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 768px) {
          .filters {
            flex-wrap: wrap;
            overflow-x: visible;
            width: auto;
          }
        }

        .filter-btn {
          background: transparent;
          border: none;
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 16px;
          font-weight: 600;
          color: #767676;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-bottom: 2px solid transparent;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .filter-btn:hover {
          color: var(--dp-charcoal, #242424);
        }

        .filter-btn.active {
          color: var(--dp-charcoal, #242424);
          font-weight: 700;
          border-bottom: 2px solid var(--dp-charcoal, #242424);
        }

        /* Product Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          align-items: start;
        }

        @media (min-width: 480px) {
          .products-grid {
            gap: 0.75rem;
          }
        }

        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }

        @media (min-width: 1280px) {
          .products-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        /* Product Card */
        .product-card-wrap {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          padding: 14px 14px 16px;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card-wrap:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.07);
        }

        /* Badges Stacked Top-Left */
        .card-badges {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 3;
          pointer-events: none;
        }

        .badge-pill {
          display: inline-block;
          font-size: 9.5px;
          font-weight: 800;
          color: #ffffff;
          border-radius: 12px;
          padding: 2.5px 7.5px;
          text-align: center;
          letter-spacing: 0.4px;
          line-height: 1.2;
        }

        .badge-green {
          background-color: #2e7d32;
        }

        .badge-orange {
          background-color: #c2410c;
        }

        .badge-red {
          background-color: #991b1b;
        }

        /* Wishlist Heart Top-Right */
        .card-wishlist-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 4;
          transition: transform 0.2s ease, background 0.2s ease;
          padding: 0;
        }

        .card-wishlist-btn:hover {
          transform: scale(1.1);
          background: #ffffff;
        }

        /* Card Image Box */
        .card-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .card-img-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          text-decoration: none;
        }

        .card-img {
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card-wrap:hover .card-img {
          transform: scale(1.05);
        }

        /* Arrow buttons on image */
        .arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #334155;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 3;
          padding: 0;
        }

        .arrow-left {
          left: 6px;
        }

        .arrow-right {
          right: 6px;
        }

        .product-card-wrap:hover .arrow-btn {
          opacity: 1;
        }

        .arrow-btn:hover {
          background: #ffffff;
          transform: translateY(-50%) scale(1.1);
        }

        /* Details */
        .card-details {
          display: flex;
          flex-direction: column;
          margin-top: auto;
        }

        .card-title-link {
          text-decoration: none;
        }

        .card-title {
          font-family: inherit;
          font-size: 14.5px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 2px 0;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-title:hover {
          color: #ea580c;
        }

        .card-category {
          font-size: 12px;
          color: #9ca3af;
          margin: 0 0 10px 0;
          text-transform: capitalize;
          font-weight: 400;
        }

        .card-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .card-price-group {
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }

        .card-old-price {
          font-size: 11.5px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 400;
        }

        .card-current-price {
          font-size: 14.5px;
          font-weight: 800;
          color: #1f2937;
        }

        .card-colors {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .color-dot {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.15);
          display: inline-block;
          flex-shrink: 0;
        }

        /* Action button: Choisir les options */
        .card-action-wrap {
          margin-top: 12px;
          overflow: hidden;
        }

        .card-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background-color: #eb8b41;
          color: #ffffff;
          padding: 8.5px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.15s ease;
          border: none;
          box-sizing: border-box;
          text-align: center;
          letter-spacing: 0.1px;
        }

        .card-action-btn:hover {
          background-color: #d97706;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .empty-state {
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
