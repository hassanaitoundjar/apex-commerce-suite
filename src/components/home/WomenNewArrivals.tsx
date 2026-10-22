"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, ArrowRight } from "lucide-react";
import { ProductItem } from "./BestSellersSection";

interface WomenNewArrivalsProps {
  products: ProductItem[];
  lang: string;
  currency?: string;
  productUrlFormat?: string;
}

export default function WomenNewArrivals({
  products = [],
  lang,
  currency = "MAD",
  productUrlFormat = "slug",
}: WomenNewArrivalsProps) {
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
    <section className="women-arrivals-section">
      <div className="container">
        {/* Header */}
        <div className="arrivals-header">
          <div>
            <span className="arr-eyebrow">DERNIERS ARRIVAGES FEMME</span>
            <h2 className="arr-title">Nouveautés de la Semaine</h2>
            <p className="arr-subtitle">
              Fraîchement ajoutées à notre collection : découvrez les dernières silhouettes prêtes à sublimer vos journées.
            </p>
          </div>
          <Link href={`/${lang}/shop?sort=newest`} className="arr-view-btn">
            <span>Explorer Tout</span>
            <ArrowRight size={14} className="arr-arrow" />
          </Link>
        </div>

        {/* 4-Column Grid */}
        <div className="arrivals-grid">
          {items.map((product) => {
            const id = product._id || product.id || product.name;
            const isWishlisted = wishlistIds.includes(id);

            return (
              <div key={id} className="arr-card">
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, product)}
                  className={`arr-wishlist-btn ${isWishlisted ? "active" : ""}`}
                  aria-label="Ajouter aux favoris"
                >
                  <Heart
                    size={16}
                    fill={isWishlisted ? "#be185d" : "none"}
                    stroke={isWishlisted ? "#be185d" : "#475569"}
                    strokeWidth={2}
                  />
                </button>

                <Link href={getProductLink(product)} className="arr-img-link">
                  <div className="arr-img-frame">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                      alt={product.name}
                      className="arr-img"
                      loading="lazy"
                    />
                    <span className="arr-tag-new">NOUVEAUTÉ</span>
                  </div>
                </Link>

                <div className="arr-info">
                  <div className="arr-meta-line">
                    <span className="arr-brand">{product.brand || "Maison"}</span>
                    <span className="arr-cat">{product.category}</span>
                  </div>

                  <Link href={getProductLink(product)} className="arr-name-link">
                    <h3 className="arr-product-name" title={product.name}>
                      {product.name}
                    </h3>
                  </Link>

                  <div className="arr-footer-row">
                    <span className="arr-price">{formatPrice(product.price)}</span>
                    <div className="arr-stars">
                      <Star size={11.5} fill="#fbbf24" stroke="#fbbf24" />
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
        .women-arrivals-section {
          padding: 68px 0 88px;
          background: #faf8f5;
          border-top: 1px solid #f1f5f9;
        }

        .arrivals-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 38px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .arr-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #be185d;
          letter-spacing: 1.2px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .arr-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
        }

        .arr-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          max-width: 520px;
        }

        .arr-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          text-decoration: none;
          padding: 9px 20px;
          border-radius: 9999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.25s ease;
        }

        .arr-view-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          transform: translateY(-2px);
        }

        .arr-arrow {
          transition: transform 0.2s ease;
        }

        .arr-view-btn:hover .arr-arrow {
          transform: translateX(3px);
        }

        .arrivals-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 26px;
        }

        .arr-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }

        .arr-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 34px rgba(190, 24, 93, 0.12);
        }

        .arr-wishlist-btn {
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

        .arr-wishlist-btn:hover {
          transform: scale(1.15);
        }

        .arr-img-link {
          text-decoration: none;
          display: block;
        }

        .arr-img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background-color: #fdfaf6;
        }

        .arr-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .arr-card:hover .arr-img {
          transform: scale(1.08);
        }

        .arr-tag-new {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #0f172a;
          color: #fbcfe8;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .arr-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .arr-meta-line {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 6px;
        }

        .arr-brand {
          font-weight: 700;
          color: #be185d;
          text-transform: uppercase;
        }

        .arr-cat {
          color: #94a3b8;
          text-transform: capitalize;
        }

        .arr-name-link {
          text-decoration: none;
          color: inherit;
        }

        .arr-product-name {
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

        .arr-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .arr-price {
          font-size: 15.5px;
          font-weight: 800;
          color: #0f172a;
        }

        .arr-stars {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
        }

        @media (max-width: 1024px) {
          .arrivals-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .arrivals-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 480px) {
          .arrivals-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .arr-product-name {
            font-size: 12.5px;
            height: 32px;
          }
          .arr-price {
            font-size: 13.5px;
          }
          .arr-info {
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
}
