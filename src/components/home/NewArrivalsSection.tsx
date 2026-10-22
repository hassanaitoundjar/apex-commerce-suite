"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, ArrowRight } from "lucide-react";
import { ProductItem } from "./BestSellersSection";

interface NewArrivalsSectionProps {
  products: ProductItem[];
  lang: string;
  currency?: string;
  productUrlFormat?: string;
}

export default function NewArrivalsSection({
  products = [],
  lang,
  currency = "MAD",
  productUrlFormat = "slug",
}: NewArrivalsSectionProps) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

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

  const items = products.slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section className="new-arrivals-section">
      <div className="container">
        {/* Header */}
        <div className="new-arrivals-header">
          <div>
            <span className="na-eyebrow">DERNIERS ARRIVAGES</span>
            <h2 className="na-title">Nouveautés de la Saison</h2>
            <p className="na-subtitle">
              Mises à jour hebdomadaires : découvrez les dernières silhouettes fraîchement sorties de nos ateliers.
            </p>
          </div>
          <Link href={`/${lang}/shop?sort=newest`} className="na-view-all">
            <span>Explorer Tout</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* 4-column Grid */}
        <div className="na-grid">
          {items.map((product) => {
            const id = product._id || product.id || product.name;
            const isWishlisted = wishlistIds.includes(id);

            return (
              <div key={id} className="na-card">
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, product)}
                  className={`na-wishlist-btn ${isWishlisted ? "active" : ""}`}
                  aria-label="Ajouter aux favoris"
                >
                  <Heart
                    size={16}
                    fill={isWishlisted ? "#ef4444" : "none"}
                    stroke={isWishlisted ? "#ef4444" : "#475569"}
                    strokeWidth={2}
                  />
                </button>

                <Link href={getProductLink(product)} className="na-img-link">
                  <div className="na-img-wrap">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                      alt={product.name}
                      className="na-img"
                      loading="lazy"
                    />
                    <span className="na-new-badge">NOUVEAU</span>
                  </div>
                </Link>

                <div className="na-info">
                  <div className="na-meta">
                    <span className="na-brand">{product.brand || "SnapShop"}</span>
                    <span className="na-cat">{product.category}</span>
                  </div>

                  <Link href={getProductLink(product)} className="na-name-link">
                    <h3 className="na-name" title={product.name}>
                      {product.name}
                    </h3>
                  </Link>

                  <div className="na-footer-row">
                    <span className="na-price">{formatPrice(product.price)}</span>
                    <div className="na-rating">
                      <Star size={11} fill="#fbbf24" stroke="#fbbf24" />
                      <span>{product.ratings || 5.0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .new-arrivals-section {
          padding: 68px 0 88px;
          background: #faf9f6;
          border-top: 1px solid #f1f5f9;
        }

        .new-arrivals-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 38px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .na-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 1px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .na-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
        }

        .na-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          max-width: 540px;
        }

        .na-view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 9999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .na-view-all:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .na-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 26px;
        }

        .na-card {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }

        .na-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.09);
        }

        .na-wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          transition: transform 0.2s ease;
        }

        .na-wishlist-btn:hover {
          transform: scale(1.12);
        }

        .na-img-link {
          text-decoration: none;
          display: block;
        }

        .na-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background-color: #f1f5f9;
        }

        .na-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .na-card:hover .na-img {
          transform: scale(1.07);
        }

        .na-new-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #0f172a;
          color: #ffffff;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .na-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .na-meta {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 6px;
        }

        .na-brand {
          font-weight: 700;
          color: #c2410c;
          text-transform: uppercase;
        }

        .na-cat {
          color: #94a3b8;
          text-transform: capitalize;
        }

        .na-name-link {
          text-decoration: none;
          color: inherit;
        }

        .na-name {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px 0;
          line-height: 1.35;
          height: 38px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .na-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .na-price {
          font-size: 15.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .na-rating {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
        }

        @media (max-width: 1024px) {
          .na-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .na-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .na-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .na-name {
            font-size: 12.5px;
            height: 32px;
          }
          .na-price {
            font-size: 13.5px;
          }
          .na-info {
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
}
