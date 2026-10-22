"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CategoryItem {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  image?: string | null;
  imageUrl?: string | null;
}

interface CategoryListSectionProps {
  categories: CategoryItem[];
  lang: string;
  title?: string;
  subtitle?: string;
}

export default function CategoryListSection({
  categories = [],
  lang,
  title = "Nos Catégories",
  subtitle = "Explorez nos nouveautés et sélections exclusives pour Elle & Lui",
}: CategoryListSectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="categories-circle-section">
      <div className="container">
        <div className="cat-section-header">
          <div className="cat-title-wrap">
            <span className="cat-eyebrow">DÉPARTEMENTS & COLLECTIONS</span>
            <h2 className="cat-section-title">{title}</h2>
            <p className="cat-section-subtitle">{subtitle}</p>
          </div>
          <Link href={`/${lang}/shop`} className="cat-view-all-link">
            <span>Tout Voir</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="categories-circle-grid">
          {categories.map((cat) => {
            const imgSrc = cat.imageUrl || cat.image || "/placeholder.png";
            return (
              <Link
                key={cat.slug || cat._id || cat.id || cat.name}
                href={`/${lang}/shop?category=${cat.slug || cat.id || cat._id}`}
                className="category-circle-card"
              >
                <div className="category-circle-frame">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="category-circle-img"
                    loading="lazy"
                  />
                  <div className="category-circle-overlay" />
                  <span className="category-pill-badge">{cat.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .categories-circle-section {
          padding: 56px 0 68px;
          background-color: #faf9f6;
          position: relative;
        }

        .cat-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 38px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .cat-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 1px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .cat-section-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 800;
          color: #111827;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
          line-height: 1.2;
        }

        .cat-section-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
          letter-spacing: -0.2px;
        }

        .cat-view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 700;
          color: #111827;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 9999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .cat-view-all-link:hover {
          background: #111827;
          color: #ffffff;
          border-color: #111827;
        }

        .categories-circle-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 32px 24px;
          width: 100%;
        }

        .category-circle-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          width: 100%;
        }

        .category-circle-frame {
          position: relative;
          width: 100%;
          max-width: 220px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          overflow: hidden;
          background-color: #0b0d12;
          box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.04);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          margin: 0 auto;
          border: 3px solid #ffffff;
        }

        .category-circle-card:hover .category-circle-frame {
          transform: translateY(-6px);
          box-shadow: 0 20px 35px -6px rgba(0, 0, 0, 0.2), 0 10px 18px -4px rgba(0, 0, 0, 0.1);
          border-color: #111827;
        }

        .category-circle-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-circle-card:hover .category-circle-img {
          transform: scale(1.1);
        }

        .category-circle-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.2);
          transition: background 0.3s ease;
        }

        .category-circle-card:hover .category-circle-overlay {
          background: rgba(0, 0, 0, 0.35);
        }

        .category-pill-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #ffffff;
          color: #111827;
          padding: 8px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.2px;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }

        .category-circle-card:hover .category-pill-badge {
          background-color: #111827;
          color: #ffffff;
          transform: translate(-50%, -50%) scale(1.05);
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
        }

        @media (max-width: 1200px) {
          .categories-circle-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 24px 18px;
          }
        }

        @media (max-width: 900px) {
          .categories-circle-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px 14px;
          }
        }

        @media (max-width: 640px) {
          .categories-circle-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px 12px;
          }
          .category-pill-badge {
            padding: 6px 14px;
            font-size: 11px;
          }
          .cat-section-header {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </section>
  );
}
