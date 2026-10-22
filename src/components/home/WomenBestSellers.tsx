"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, Eye } from "lucide-react";
import { ProductItem } from "./BestSellersSection";

interface WomenBestSellersProps {
  products: ProductItem[];
  currency?: string;
  lang: string;
  productUrlFormat?: string;
  title?: string;
  subtitle?: string;
}

export default function WomenBestSellers({
  products = [],
  currency = "MAD",
  lang = "fr",
  productUrlFormat = "slug",
  title = "Les Pièces Iconiques",
  subtitle = "Nos créations les plus plébiscitées par notre communauté d'initiées",
}: WomenBestSellersProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Wishlist localStorage sync
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
    return (
      amount.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " " + currency
    );
  };

  // Women Tabs Filter definition
  const tabs = [
    { id: "all", label: "Toutes les Pièces" },
    { id: "dresses", label: "Robes & Soirée" },
    { id: "coats", label: "Manteaux & Trenchs" },
    { id: "knitwear", label: "Mailles & Cachemire" },
    { id: "bags", label: "Sacs & Maroquinerie" },
    { id: "shoes", label: "Escarpins & Bottines" },
    { id: "sale", label: "Ventes Privées" },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "sale") return p.isOnSale;

    const prodCat = (p.category || "").toLowerCase();
    const target = activeTab.toLowerCase();
    return prodCat === target || prodCat.includes(target) || target.includes(prodCat);
  });

  return (
    <section className="women-bestsellers-section">
      <div className="container">
        {/* Header & Tabs */}
        <div className="section-header-block">
          <div className="header-text">
            <span className="eyebrow-tag">SÉLECTION INCONTOURNABLE</span>
            <h2 className="section-title">{title}</h2>
            <p className="section-desc">{subtitle}</p>
          </div>

          <div className="tabs-pill-container">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-item-btn ${isActive ? "active" : ""}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Column Luxury Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state-box">
            <p>Aucune pièce trouvée dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="products-card-grid">
            {filteredProducts.map((product) => {
              const id = product._id || product.id || product.name;
              const isWishlisted = wishlistIds.includes(id);

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

              const isBestSeller = (product.ratings && product.ratings >= 4.9) || (product.reviewsCount && product.reviewsCount >= 28);

              return (
                <div key={id} className="luxury-product-card">
                  {/* Floating Badges */}
                  <div className="badges-stack">
                    {discountPercent > 0 && (
                      <span className="badge-pill badge-sale">-{discountPercent}%</span>
                    )}
                    {isBestSeller && (
                      <span className="badge-pill badge-iconic">COUP DE CŒUR</span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, product)}
                    className={`wishlist-heart-btn ${isWishlisted ? "active" : ""}`}
                    aria-label="Ajouter aux favoris"
                    title="Ajouter aux favoris"
                  >
                    <Heart
                      size={17}
                      fill={isWishlisted ? "#be185d" : "none"}
                      stroke={isWishlisted ? "#be185d" : "#475569"}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Image with Dual Look Hover */}
                  <Link href={getProductLink(product)} className="product-img-anchor">
                    <div className="product-img-box">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                        alt={product.name}
                        className="look-img primary-look"
                        loading="lazy"
                      />
                      {product.images && product.images.length > 1 && (
                        <img
                          src={product.images[1]}
                          alt={`${product.name} vue 2`}
                          className="look-img secondary-look"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Details Card Info */}
                  <div className="product-details-box">
                    <div className="brand-category-row">
                      <span className="brand-name">{product.brand || "Maison Couture"}</span>
                      <span className="category-tag">{product.category}</span>
                    </div>

                    <Link href={getProductLink(product)} className="title-anchor">
                      <h3 className="product-heading" title={product.name}>
                        {product.name}
                      </h3>
                    </Link>

                    {/* Ratings */}
                    <div className="rating-stars-line">
                      <div className="stars-cluster">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={11.5}
                            fill={i < Math.floor(product.ratings || 5) ? "#fbbf24" : "none"}
                            stroke="#fbbf24"
                          />
                        ))}
                      </div>
                      <span className="reviews-num">({product.reviewsCount || 18})</span>
                    </div>

                    {/* Price and Quick View */}
                    <div className="price-and-action-bar">
                      <div className="price-figures">
                        {discountPercent > 0 && (
                          <span className="strike-price">{formatPrice(originalPrice)}</span>
                        )}
                        <span className="active-price">{formatPrice(currentPrice)}</span>
                      </div>

                      <Link
                        href={getProductLink(product)}
                        className="quick-view-action"
                        title="Voir la création"
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
        .women-bestsellers-section {
          padding: 72px 0 92px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .section-header-block {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 42px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-text {
          max-width: 520px;
        }

        .eyebrow-tag {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #be185d;
          letter-spacing: 1.2px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .section-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
          line-height: 1.2;
        }

        .section-desc {
          font-size: 15px;
          color: #64748b;
          margin: 0;
        }

        .tabs-pill-container {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          background: #faf8f5;
          padding: 6px;
          border-radius: 9999px;
          border: 1px solid #e8e5e0;
        }

        .tab-item-btn {
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          padding: 8px 18px;
          border-radius: 9999px;
          transition: all 0.25s ease;
        }

        .tab-item-btn:hover {
          color: #0f172a;
        }

        .tab-item-btn.active {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
        }

        /* 4-Column Luxury Product Grid */
        .products-card-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
        }

        .luxury-product-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 38px rgba(190, 24, 93, 0.12);
        }

        .badges-stack {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          z-index: 3;
          pointer-events: none;
        }

        .badge-pill {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          color: #ffffff;
          border-radius: 6px;
          padding: 3px 8px;
          letter-spacing: 0.5px;
        }

        .badge-sale {
          background-color: #be185d;
        }

        .badge-iconic {
          background-color: #0f172a;
          color: #fbcfe8;
        }

        .wishlist-heart-btn {
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

        .wishlist-heart-btn:hover {
          transform: scale(1.15);
          background: #ffffff;
        }

        .product-img-anchor {
          text-decoration: none;
          display: block;
          background-color: #fdfaf6;
        }

        .product-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
        }

        .look-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        }

        .primary-look {
          opacity: 1;
        }

        .secondary-look {
          position: absolute;
          inset: 0;
          opacity: 0;
        }

        .luxury-product-card:hover .primary-look {
          transform: scale(1.06);
        }

        .luxury-product-card:hover .secondary-look {
          opacity: 1;
          transform: scale(1.06);
        }

        .product-details-box {
          padding: 16px 16px 18px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .brand-category-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 6px;
        }

        .brand-name {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #be185d;
        }

        .category-tag {
          color: #94a3b8;
          text-transform: capitalize;
        }

        .title-anchor {
          text-decoration: none;
          color: inherit;
        }

        .product-heading {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14.5px;
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

        .product-heading:hover {
          color: #be185d;
        }

        .rating-stars-line {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .stars-cluster {
          display: flex;
          gap: 2px;
        }

        .reviews-num {
          font-size: 11px;
          color: #94a3b8;
        }

        .price-and-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .price-figures {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .active-price {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.2px;
        }

        .strike-price {
          font-size: 12.5px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }

        .quick-view-action {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #faf8f5;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .quick-view-action:hover {
          background: #0f172a;
          color: #ffffff;
          transform: scale(1.1);
        }

        .empty-state-box {
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
          background: #faf8f5;
          border-radius: 16px;
          border: 1px dashed #cbd5e1;
        }

        @media (max-width: 1200px) {
          .products-card-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 22px;
          }
        }

        @media (max-width: 840px) {
          .products-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .section-header-block {
            flex-direction: column;
            align-items: flex-start;
          }
          .tabs-pill-container {
            width: 100%;
            overflow-x: auto;
            flex-wrap: nowrap;
            justify-content: flex-start;
          }
          .tab-item-btn {
            white-space: nowrap;
            padding: 6px 14px;
            font-size: 12px;
          }
          .products-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          .product-heading {
            font-size: 13px;
            height: 34px;
          }
          .active-price {
            font-size: 14px;
          }
          .product-details-box {
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
}
