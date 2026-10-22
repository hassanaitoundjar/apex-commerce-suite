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

interface InstagramFeedProps {
  lang: string;
}

export default function InstagramFeed({ lang }: InstagramFeedProps) {
  const feedItems = [
    {
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      handle: "@clara_parisinstyle",
      tag: "Look Robe & Bottines",
      link: `/${lang}/shop?category=women`,
    },
    {
      img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=600&q=80",
      handle: "@alex_menswear",
      tag: "Look Manteau Laine Homme",
      link: `/${lang}/shop?category=men`,
    },
    {
      img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
      handle: "@sophie_moderne",
      tag: "Trench Coat & Sac Cuir",
      link: `/${lang}/shop?category=jackets`,
    },
    {
      img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80",
      handle: "@marc_streetwear",
      tag: "Costume Déstructuré Homme",
      link: `/${lang}/shop?category=suits`,
    },
    {
      img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
      handle: "@elena_couture",
      tag: "Robe Soie & Talons",
      link: `/${lang}/shop?category=dresses`,
    },
    {
      img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
      handle: "@david_urban",
      tag: "Hoodie 450 GSM & Denim",
      link: `/${lang}/shop?category=hoodies`,
    },
  ];

  return (
    <section className="instagram-feed-section">
      <div className="container">
        <div className="feed-header">
          <div className="feed-header-left">
            <span className="feed-eyebrow">COMMUNAUTÉ &amp; INSPIRATION</span>
            <h2 className="feed-title">#SnapShopStyle</h2>
            <p className="feed-subtitle">
              Partagez vos tenues sur Instagram avec le hashtag <strong>#SnapShopStyle</strong> pour apparaître sur notre lookbook mondial.
            </p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-instagram-follow"
          >
            <InstagramIcon size={17} />
            <span>Suivre @SnapShop</span>
          </a>
        </div>

        <div className="feed-grid">
          {feedItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="feed-card"
            >
              <img
                src={item.img}
                alt={item.tag}
                className="feed-img"
                loading="lazy"
              />
              <div className="feed-overlay">
                <InstagramIcon size={22} className="feed-icon" />
                <span className="feed-handle">{item.handle}</span>
                <span className="feed-tag-pill">{item.tag}</span>
                <span className="feed-shop-action">
                  <span>Shopper le look</span>
                  <ArrowUpRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .instagram-feed-section {
          padding: 60px 0 80px;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .feed-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 1px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .feed-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
        }

        .feed-subtitle {
          font-size: 14.5px;
          color: #64748b;
          margin: 0;
          max-width: 520px;
        }

        .feed-subtitle strong {
          color: #0f172a;
        }

        .btn-instagram-follow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          padding: 9px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-instagram-follow:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .feed-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }

        .feed-card {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .feed-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .feed-card:hover .feed-img {
          transform: scale(1.08);
        }

        .feed-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 14px;
          text-align: center;
          color: #ffffff;
        }

        .feed-card:hover .feed-overlay {
          opacity: 1;
        }

        .feed-icon {
          color: #ffffff;
          margin-bottom: 8px;
        }

        .feed-handle {
          font-size: 11px;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 4px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .feed-tag-pill {
          font-size: 11.5px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 8px;
          line-height: 1.25;
        }

        .feed-shop-action {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10.5px;
          font-weight: 700;
          color: #ffffff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.6);
          padding-bottom: 1px;
        }

        @media (max-width: 1024px) {
          .feed-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .feed-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .feed-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}
