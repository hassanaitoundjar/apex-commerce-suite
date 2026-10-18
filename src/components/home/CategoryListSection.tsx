"use client";

import React, { useState } from "react";
import Link from "next/link";

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
  seeMoreText?: string;
  seeLessText?: string;
}

export default function CategoryListSection({
  categories,
  lang,
  title = "Nos catégories",
  subtitle = "Explorez nos nouveautés et collections exclusives",
  seeMoreText = "Voir Plus",
  seeLessText = "Voir Moins",
}: CategoryListSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="category-list-section">
      <div className="container">
        <div className="category-list-header">
          <h2 className="cl-title">{title}</h2>
          <p className="cl-desc">{subtitle}</p>
        </div>

        <div className={`cl-grid ${showAll ? "show-all" : ""}`}>
          {categories.map((cat) => {
            const imgSrc = cat.image || cat.imageUrl;
            return (
              <Link
                key={cat.slug || cat._id || cat.id || cat.name}
                href={`/${lang}/shop?category=${cat.slug || cat.id || cat._id}`}
                className="cl-card"
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="cl-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="cl-image placeholder-image" />
                )}
                <div className="cl-pill">{cat.name}</div>
              </Link>
            );
          })}
        </div>

        {categories.length > 6 && (
          <div className="cl-actions">
            <button
              type="button"
              className="btn-list"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? seeLessText : seeMoreText}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .category-list-section {
          padding-top: 5rem;
          padding-bottom: 5rem;
        }

        .category-list-header {
          margin-bottom: 30px;
          text-align: left;
        }

        .cl-title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 34px;
          font-weight: 700;
          color: var(--dp-charcoal, #242424);
          margin: 0 0 10px 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        @media (min-width: 1024px) {
          .cl-title {
            font-size: 36px;
          }
        }

        @media (max-width: 480px) {
          .cl-title {
            font-size: 26px;
          }
        }

        .cl-desc {
          font-family: var(--font-body, inherit);
          font-size: 16px;
          color: #767676;
          line-height: 1.5;
          margin: 0;
        }

        .cl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .btn-list {
          width: 50%;
          background-color: #c24b0e;
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 10px 16px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-list:hover {
          background-color: var(--dp-charcoal, #242424);
          color: var(--dp-white, #ffffff);
        }

        /* Hide items after 6th on mobile if not showing all */
        @media (max-width: 639px) {
          .cl-grid:not(.show-all) .cl-card:nth-child(n+7) {
            display: none;
          }
        }

        @media (min-width: 640px) {
          .cl-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .cl-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 2rem;
          }
        }

        .cl-actions {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          padding: 0 1rem;
        }

        @media (min-width: 640px) {
          .cl-actions {
            display: none;
          }
        }

        .cl-card {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          overflow: hidden;
          text-decoration: none;
          background-color: #1a1916;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
          transition: transform 0.4s cubic-bezier(0, 0, 0.44, 1.18), box-shadow 0.4s ease;
          transform: translate3d(0, 0, 0);
          isolation: isolate;
        }

        .cl-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 36px rgba(0, 0, 0, 0.3);
        }

        /* Dark overlay above images */
        .cl-card::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          background-color: #000000;
          opacity: 0.4;
          transition: opacity 0.5s cubic-bezier(0, 0, 0.44, 1.18);
          pointer-events: none;
        }

        .cl-card:hover::before {
          opacity: 0.58;
        }

        @media (max-width: 768.98px) {
          .cl-card::before {
            opacity: 0.44;
          }
        }

        .cl-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.08);
          transition: transform 0.5s cubic-bezier(0, 0, 0.44, 1.18);
          display: block;
        }

        .placeholder-image {
          background-color: #2b2a27;
        }

        .cl-card:hover .cl-image {
          transform: scale(1);
        }

        .cl-pill {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: var(--dp-white, #ffffff);
          color: var(--dp-charcoal, #242424);
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 15px;
          font-weight: 600;
          padding: 0.55rem 1.35rem;
          border-radius: 2rem;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
          transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
          z-index: 3;
        }

        .cl-card:hover .cl-pill {
          background-color: var(--dp-charcoal, #242424);
          color: var(--dp-white, #ffffff);
          transform: translate(-50%, -50%) scale(1.04);
        }
      `}</style>
    </section>
  );
}
