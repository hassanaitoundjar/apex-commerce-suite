"use client";

import React from "react";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { Flame, ArrowRight, Star, Clock } from "lucide-react";
import { ProductItem } from "./BestSellersSection";

interface FlashDealsSectionProps {
  products: ProductItem[];
  lang: string;
  currency?: string;
  countdownDate?: string | Date;
  productUrlFormat?: string;
}

export default function FlashDealsSection({
  products = [],
  lang,
  currency = "MAD",
  countdownDate,
  productUrlFormat = "slug",
}: FlashDealsSectionProps) {
  const saleProducts = products.filter((p) => p.isOnSale).slice(0, 4);

  if (saleProducts.length === 0) return null;

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

  return (
    <section className="flash-deals-section">
      <div className="container">
        {/* Banner Card Container */}
        <div className="flash-deals-box">
          <div className="flash-header-row">
            <div className="flash-title-block">
              <div className="flash-badge">
                <Flame size={15} />
                <span>OFFRES FLASH DU MOMENT</span>
              </div>
              <h2 className="flash-title">Ventes Privées & Promotions</h2>
              <p className="flash-subtitle">
                Profitez de réductions exceptionnelles jusqu&apos;à -40% sur une sélection de pièces couture.
              </p>
            </div>

            {countdownDate && (
              <div className="flash-countdown-wrap">
                <span className="countdown-label">
                  <Clock size={14} />
                  TEMPS RESTANT :
                </span>
                <Countdown
                  targetDate={
                    typeof countdownDate === "string"
                      ? countdownDate
                      : countdownDate?.toISOString?.()
                  }
                />
              </div>
            )}
          </div>

          {/* Grid of 4 Flash Deals */}
          <div className="flash-grid">
            {saleProducts.map((p) => {
              const id = p._id || p.id || p.name;
              let discountPercent = 0;
              let originalPrice = p.price;
              let currentPrice = p.price;

              if (p.salePrice && p.salePrice < p.price) {
                originalPrice = p.price;
                currentPrice = p.salePrice;
                discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
              } else if (p.salePrice && p.salePrice > p.price) {
                originalPrice = p.salePrice;
                currentPrice = p.price;
                discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
              }

              return (
                <Link
                  key={id}
                  href={getProductLink(p)}
                  className="flash-card"
                >
                  <div className="flash-img-frame">
                    <img
                      src={p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png"}
                      alt={p.name}
                      className="flash-img"
                      loading="lazy"
                    />
                    {discountPercent > 0 && (
                      <span className="flash-discount-tag">-{discountPercent}%</span>
                    )}
                  </div>

                  <div className="flash-card-info">
                    <span className="flash-category">{p.category}</span>
                    <h3 className="flash-product-name">{p.name}</h3>

                    <div className="flash-price-row">
                      <span className="flash-curr-price">{formatPrice(currentPrice)}</span>
                      {discountPercent > 0 && (
                        <span className="flash-old-price">{formatPrice(originalPrice)}</span>
                      )}
                    </div>

                    {/* Stock Urgency Bar */}
                    <div className="stock-urgency-wrap">
                      <div className="stock-bar">
                        <div className="stock-fill" style={{ width: "82%" }} />
                      </div>
                      <span className="stock-text">Stock limité : 82% réservé</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="flash-footer">
            <Link
              href={`/${lang}/shop?filter=sale`}
              className="btn-all-deals"
            >
              <span>VOIR TOUTES LES PROMOTIONS</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flash-deals-section {
          padding: 30px 0 60px;
          background-color: #faf9f6;
        }

        .flash-deals-box {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b2e 100%);
          border-radius: 28px;
          padding: 48px;
          color: #ffffff;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
          position: relative;
          overflow: hidden;
        }

        .flash-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .flash-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 10px;
        }

        .flash-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
        }

        .flash-subtitle {
          color: #cbd5e1;
          font-size: 14.5px;
          margin: 0;
          max-width: 500px;
        }

        .flash-countdown-wrap {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 14px 20px;
        }

        .countdown-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #f59e0b;
          margin-bottom: 8px;
        }

        /* 4 Cards Grid */
        .flash-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          margin-bottom: 36px;
        }

        .flash-card {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          text-decoration: none;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }

        .flash-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 35px rgba(0, 0, 0, 0.25);
        }

        .flash-img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #f1f5f9;
          overflow: hidden;
        }

        .flash-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .flash-card:hover .flash-img {
          transform: scale(1.08);
        }

        .flash-discount-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #dc2626;
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .flash-card-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .flash-category {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .flash-product-name {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px 0;
          height: 38px;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .flash-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 12px;
        }

        .flash-curr-price {
          font-size: 16px;
          font-weight: 800;
          color: #dc2626;
        }

        .flash-old-price {
          font-size: 12.5px;
          color: #94a3b8;
          text-decoration: line-through;
        }

        .stock-urgency-wrap {
          margin-top: auto;
        }

        .stock-bar {
          height: 5px;
          background: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .stock-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          border-radius: 9999px;
        }

        .stock-text {
          font-size: 10.5px;
          color: #c2410c;
          font-weight: 600;
        }

        .flash-footer {
          display: flex;
          justify-content: center;
        }

        .btn-all-deals {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #0f172a;
          font-weight: 700;
          font-size: 13px;
          padding: 13px 28px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .btn-all-deals:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 1024px) {
          .flash-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .flash-deals-box {
            padding: 32px 24px;
          }
        }

        @media (max-width: 640px) {
          .flash-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .flash-deals-box {
            padding: 24px 16px;
            border-radius: 20px;
          }
          .flash-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .flash-countdown-wrap {
            width: 100%;
          }
          .flash-card-info {
            padding: 10px;
          }
          .flash-product-name {
            font-size: 12.5px;
            height: 32px;
          }
          .flash-curr-price {
            font-size: 13.5px;
          }
        }
      `}</style>
    </section>
  );
}
