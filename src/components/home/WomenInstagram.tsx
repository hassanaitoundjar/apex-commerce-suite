"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function InstagramIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface WomenInstagramProps {
  lang: string;
}

export default function WomenInstagram({ lang }: WomenInstagramProps) {
  const feedItems = [
    {
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=650&q=85",
      handle: "@camille_parisienne",
      tag: "Look Robe Soie & Escarpins",
      link: `/${lang}/shop?category=dresses`,
    },
    {
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=650&q=85",
      handle: "@sophie_couture",
      tag: "Manteau Cachemire & Cuir",
      link: `/${lang}/shop?category=coats`,
    },
    {
      img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=650&q=85",
      handle: "@elena_style",
      tag: "Trench Ceinturé & Lunettes",
      link: `/${lang}/shop?category=coats`,
    },
    {
      img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=650&q=85",
      handle: "@chloe_milan",
      tag: "Sac Cuir Matelassé Noir",
      link: `/${lang}/shop?category=bags`,
    },
    {
      img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=650&q=85",
      handle: "@victoria_lux",
      tag: "Robe Soirée Satin Émeraude",
      link: `/${lang}/shop?category=dresses`,
    },
    {
      img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=650&q=85",
      handle: "@lea_provence",
      tag: "Escarpins Stiletto Vernis",
      link: `/${lang}/shop?category=shoes`,
    },
  ];

  return (
    <section className="women-instagram-section">
      <div className="container">
        <div className="feed-header">
          <div className="feed-header-left">
            <span className="feed-eyebrow">COMMUNAUTÉ &amp; LOOKBOOK CLIENTES</span>
            <h2 className="feed-title">#SnapShopWomen</h2>
            <p className="feed-subtitle">
              Partagez vos plus belles silhouettes sur Instagram avec le tag{" "}
              <strong>#SnapShopWomen</strong> pour rejoindre notre lookbook d&apos;exception.
            </p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-instagram-follow"
          >
            <InstagramIcon size={18} />
            <span>Suivre @SnapShopWomen</span>
          </a>
        </div>

        <div className="feed-grid">
          {feedItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="feed-card"
            >
              <div className="feed-img-wrapper">
                <img
                  src={item.img}
                  alt={`Lookbook SnapShop ${item.handle}`}
                  loading="lazy"
                />
              </div>

              <div className="feed-overlay">
                <div className="feed-icon-circle">
                  <InstagramIcon size={20} />
                </div>
                <div className="feed-info">
                  <span className="feed-handle">{item.handle}</span>
                  <span className="feed-tag">{item.tag}</span>
                  <span className="feed-shop-link">
                    <span>Shopper le look</span>
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .women-instagram-section {
          padding: 80px 0 100px;
          background: #ffffff;
          position: relative;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .feed-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .feed-header-left {
          max-width: 600px;
        }

        .feed-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d97706;
          margin-bottom: 8px;
        }

        .feed-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          margin: 0 0 10px;
          font-family: var(--font-playfair, "Playfair Display", Georgia, serif);
        }

        .feed-subtitle {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
        }

        .feed-subtitle strong {
          color: #0f172a;
        }

        .btn-instagram-follow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: #0f172a;
          color: #ffffff;
          border-radius: 9999px;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.12);
        }

        .btn-instagram-follow:hover {
          background: #d97706;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(217, 119, 6, 0.28);
          color: #ffffff;
        }

        .feed-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        .feed-card {
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 16px;
          overflow: hidden;
          background: #f1f5f9;
          display: block;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feed-img-wrapper {
          width: 100%;
          height: 100%;
        }

        .feed-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feed-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.15);
        }

        .feed-card:hover img {
          transform: scale(1.08);
        }

        .feed-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(15, 23, 42, 0.92) 0%,
            rgba(15, 23, 42, 0.4) 50%,
            rgba(15, 23, 42, 0.2) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18px;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .feed-card:hover .feed-overlay {
          opacity: 1;
        }

        .feed-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          align-self: flex-end;
          transform: translateY(-10px);
          transition: transform 0.3s ease;
        }

        .feed-card:hover .feed-icon-circle {
          transform: translateY(0);
        }

        .feed-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          transform: translateY(10px);
          transition: transform 0.3s ease;
        }

        .feed-card:hover .feed-info {
          transform: translateY(0);
        }

        .feed-handle {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .feed-tag {
          font-size: 0.72rem;
          color: #cbd5e1;
          margin-bottom: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .feed-shop-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #f59e0b;
        }

        @media (max-width: 1200px) {
          .feed-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 640px) {
          .women-instagram-section {
            padding: 60px 0 80px;
          }

          .feed-title {
            font-size: 1.8rem;
          }

          .feed-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .feed-overlay {
            padding: 12px;
          }
        }
      `}</style>
    </section>
  );
}
