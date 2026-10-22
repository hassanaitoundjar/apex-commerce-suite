"use client";

import React from "react";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { Flame, ArrowRight, Clock } from "lucide-react";
import { ProductItem } from "./BestSellersSection";

interface WomenFlashDealsProps {
  products: ProductItem[];
  lang: string;
  currency?: string;
  countdownDate?: string | Date;
  productUrlFormat?: string;
}

export default function WomenFlashDeals({
  products = [],
  lang,
  currency = "MAD",
  countdownDate,
  productUrlFormat = "slug",
}: WomenFlashDealsProps) {
  const saleProducts = products.filter((p) => p.isOnSale).slice(0, 4);

  if (saleProducts.length === 0) return null;

  const targetDateStr =
    typeof countdownDate === "string"
      ? countdownDate
      : countdownDate?.toISOString?.();

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
    <section className="women-flash-section">
      <div className="container">
        <div className="flash-banner-wrapper">
          {/* Header Row */}
          <div className="flash-header-row">
            <div className="flash-title-block">
              <span className="flash-pill">
                <Flame size={14} className="flame-icon" />
                VENTES PRIVÉES EXCLUSIVES
              </span>
              <h2 className="flash-main-title">Offres Limitées Femme</h2>
              <p className="flash-main-desc">
                Jusqu&apos;à -35% sur une sélection de robes de cocktail, blazers et maroquinerie d&apos;exception.
              </p>
            </div>

            {targetDateStr && (
              <div className="flash-timer-box">
                <div className="timer-label">
                  <Clock size={14} />
                  <span>FIN DE LA VENTE PRIVÉE DANS :</span>
                </div>
                <Countdown targetDate={targetDateStr} />
              </div>
            )}
          </div>

          {/* 4 Cards Grid */}
          <div className="flash-cards-grid">
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
                  className="flash-item-card"
                >
                  <div className="flash-img-frame">
                    <img
                      src={p.images && p.images.length > 0 ? p.images[0] : "/placeholder.png"}
                      alt={p.name}
                      className="flash-img"
                      loading="lazy"
                    />
                    {discountPercent > 0 && (
                      <span className="flash-discount-badge">-{discountPercent}%</span>
                    )}
                  </div>

                  <div className="flash-details">
                    <span className="flash-cat-label">{p.category}</span>
                    <h3 className="flash-item-title">{p.name}</h3>

                    <div className="flash-prices-row">
                      <span className="flash-sale-price">{formatPrice(currentPrice)}</span>
                      {discountPercent > 0 && (
                        <span className="flash-regular-price">{formatPrice(originalPrice)}</span>
                      )}
                    </div>

                    <div className="stock-meter-wrap">
                      <div className="meter-track">
                        <div className="meter-fill" style={{ width: "86%" }} />
                      </div>
                      <span className="meter-caption">Stock restant limité : 86% réservé</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Button */}
          <div className="flash-action-center">
            <Link href={`/${lang}/shop?filter=sale`} className="btn-explore-sales">
              <span>VOIR TOUTES LES VENTES PRIVÉES</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .women-flash-section {
          padding: 20px 0 60px;
          background-color: #faf8f5;
        }

        .flash-banner-wrapper {
          background: linear-gradient(135deg, #180d19 0%, #1c1122 50%, #0d0e14 100%);
          border-radius: 28px;
          padding: 50px 40px;
          color: #ffffff;
          box-shadow: 0 20px 50px rgba(24, 13, 25, 0.4);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(244, 114, 182, 0.15);
        }

        .flash-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 38px;
          flex-wrap: wrap;
          gap: 24px;
        }

        .flash-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(190, 24, 93, 0.25);
          border: 1px solid rgba(244, 114, 182, 0.4);
          color: #fbcfe8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 12px;
        }

        .flame-icon {
          color: #f472b6;
        }

        .flash-main-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: -0.6px;
        }

        .flash-main-desc {
          color: #cbd5e1;
          font-size: 15px;
          margin: 0;
          max-width: 520px;
        }

        .flash-timer-box {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(244, 114, 182, 0.2);
          border-radius: 20px;
          padding: 16px 22px;
        }

        .timer-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #f472b6;
          margin-bottom: 8px;
        }

        /* 4 Cards Grid */
        .flash-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 36px;
        }

        .flash-item-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }

        .flash-item-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(190, 24, 93, 0.3);
        }

        .flash-img-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #fdfaf6;
          overflow: hidden;
        }

        .flash-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .flash-item-card:hover .flash-img {
          transform: scale(1.08);
        }

        .flash-discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #be185d;
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          padding: 3px 9px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .flash-details {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .flash-cat-label {
          font-size: 11px;
          color: #be185d;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .flash-item-title {
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

        .flash-prices-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 12px;
        }

        .flash-sale-price {
          font-size: 16px;
          font-weight: 800;
          color: #be185d;
        }

        .flash-regular-price {
          font-size: 12.5px;
          color: #94a3b8;
          text-decoration: line-through;
        }

        .stock-meter-wrap {
          margin-top: auto;
        }

        .meter-track {
          height: 5px;
          background: #f1f5f9;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .meter-fill {
          height: 100%;
          background: linear-gradient(90deg, #f472b6, #be185d);
          border-radius: 9999px;
        }

        .meter-caption {
          font-size: 10.5px;
          color: #be185d;
          font-weight: 600;
        }

        .flash-action-center {
          display: flex;
          justify-content: center;
        }

        .btn-explore-sales {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #090a0d;
          font-weight: 700;
          font-size: 13px;
          padding: 13px 28px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .btn-explore-sales:hover {
          background: #fdf2f8;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.25);
        }

        @media (max-width: 1024px) {
          .flash-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .flash-banner-wrapper {
            padding: 34px 24px;
          }
        }

        @media (max-width: 640px) {
          .flash-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .flash-banner-wrapper {
            padding: 24px 16px;
            border-radius: 20px;
          }
          .flash-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .flash-timer-box {
            width: 100%;
          }
          .flash-details {
            padding: 10px;
          }
          .flash-item-title {
            font-size: 12.5px;
            height: 32px;
          }
          .flash-sale-price {
            font-size: 13.5px;
          }
        }
      `}</style>
    </section>
  );
}
