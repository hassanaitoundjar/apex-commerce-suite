"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryItem } from "./CategoryListSection";

interface WomenCategorySliderProps {
  categories: CategoryItem[];
  lang: string;
}

export default function WomenCategorySlider({
  categories = [],
  lang,
}: WomenCategorySliderProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="women-categories-section">
      <div className="container">
        {/* Section Header */}
        <div className="cat-header-row">
          <div className="cat-title-wrap">
            <span className="cat-eyebrow">DÉPARTEMENTS DE CRÉATION</span>
            <h2 className="cat-title">Explorez par Catégorie</h2>
            <p className="cat-subtitle">
              Des robes d&apos;exception aux mailles douces et maroquinerie italienne
            </p>
          </div>

          <Link href={`/${lang}/shop`} className="cat-view-all-btn">
            <span>Tout Voir</span>
            <ArrowRight size={14} className="cat-arrow" />
          </Link>
        </div>

        {/* Categories Circular Showcase */}
        <div className="categories-grid">
          {categories.map((cat) => {
            const imgSrc = cat.imageUrl || cat.image || "/placeholder.png";

            return (
              <Link
                key={cat.slug || cat._id || cat.id || cat.name}
                href={`/${lang}/shop?category=${cat.slug || cat.id || cat._id}`}
                className="category-circle-link"
              >
                <div className="circle-frame">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="circle-image"
                    loading="lazy"
                  />
                  <div className="circle-vignette" />
                  <span className="circle-pill">{cat.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .women-categories-section {
          padding: 64px 0 76px;
          background: #faf8f5;
          position: relative;
        }

        .cat-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .cat-title-wrap {
          max-width: 500px;
        }

        .cat-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #be185d;
          letter-spacing: 1.2px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .cat-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px 0;
          letter-spacing: -0.6px;
        }

        .cat-subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
        }

        .cat-view-all-btn {
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

        .cat-view-all-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          transform: translateY(-2px);
        }

        .cat-arrow {
          transition: transform 0.2s ease;
        }

        .cat-view-all-btn:hover .cat-arrow {
          transform: translateX(3px);
        }

        /* 5-Column Responsive Grid */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 32px 24px;
        }

        .category-circle-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
        }

        .circle-frame {
          position: relative;
          width: 100%;
          max-width: 220px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          overflow: hidden;
          background-color: #090a0d;
          box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06);
          border: 3px solid #ffffff;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
          margin: 0 auto;
        }

        .category-circle-link:hover .circle-frame {
          transform: translateY(-6px);
          box-shadow: 0 22px 40px -6px rgba(190, 24, 93, 0.25), 0 12px 20px -4px rgba(0, 0, 0, 0.12);
          border-color: #f472b6;
        }

        .circle-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-circle-link:hover .circle-image {
          transform: scale(1.1);
        }

        .circle-vignette {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(9, 10, 13, 0.22);
          transition: background 0.3s ease;
        }

        .category-circle-link:hover .circle-vignette {
          background: rgba(9, 10, 13, 0.38);
        }

        .circle-pill {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #ffffff;
          color: #0f172a;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.2px;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }

        .category-circle-link:hover .circle-pill {
          background-color: #0f172a;
          color: #ffffff;
          transform: translate(-50%, -50%) scale(1.06);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        @media (max-width: 1200px) {
          .categories-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 24px 18px;
          }
        }

        @media (max-width: 900px) {
          .categories-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px 14px;
          }
        }

        @media (max-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px 12px;
          }
          .circle-pill {
            padding: 6px 12px;
            font-size: 11px;
          }
          .cat-header-row {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </section>
  );
}
