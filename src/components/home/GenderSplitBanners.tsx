"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface GenderSplitBannersProps {
  lang: string;
}

export default function GenderSplitBanners({ lang }: GenderSplitBannersProps) {
  return (
    <section className="gender-split-section">
      <div className="container">
        <div className="gender-split-grid">
          {/* Card 1: WOMEN */}
          <div className="gender-card women-card">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85"
              alt="Univers Mode Femme"
              className="gender-bg-img"
              loading="lazy"
            />
            <div className="gender-overlay" />

            <div className="gender-content">
              <span className="gender-badge">
                <Sparkles size={13} />
                NOUVELLE SAISON
              </span>

              <h2 className="gender-title">Univers Femme</h2>
              <p className="gender-desc">
                Robes fluides, manteaux structurés, mailles d&apos;exception et maroquinerie italienne pour une silhouette affirmée.
              </p>

              {/* Quick links to categories */}
              <div className="gender-pills-row">
                <Link href={`/${lang}/shop?category=dresses`} className="gender-pill">
                  Robes
                </Link>
                <Link href={`/${lang}/shop?category=jackets`} className="gender-pill">
                  Manteaux
                </Link>
                <Link href={`/${lang}/shop?category=accessories`} className="gender-pill">
                  Sacs
                </Link>
                <Link href={`/${lang}/shop?category=shoes`} className="gender-pill">
                  Chaussures
                </Link>
              </div>

              <Link href={`/${lang}/shop?category=women`} className="gender-cta-btn">
                <span>DÉCOUVRIR FEMME</span>
                <ArrowRight size={16} className="cta-arrow" />
              </Link>
            </div>
          </div>

          {/* Card 2: MEN */}
          <div className="gender-card men-card">
            <img
              src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1000&q=85"
              alt="Univers Mode Homme"
              className="gender-bg-img"
              loading="lazy"
            />
            <div className="gender-overlay" />

            <div className="gender-content">
              <span className="gender-badge">
                <Sparkles size={13} />
                TENDANCES 2026
              </span>

              <h2 className="gender-title">Univers Homme</h2>
              <p className="gender-desc">
                Costumes acérés, blousons en cuir véritable, hoodies streetwear 450 GSM et sneakers artisanales.
              </p>

              {/* Quick links to categories */}
              <div className="gender-pills-row">
                <Link href={`/${lang}/shop?category=suits`} className="gender-pill">
                  Costumes
                </Link>
                <Link href={`/${lang}/shop?category=jackets`} className="gender-pill">
                  Blousons
                </Link>
                <Link href={`/${lang}/shop?category=hoodies`} className="gender-pill">
                  Hoodies
                </Link>
                <Link href={`/${lang}/shop?category=shoes`} className="gender-pill">
                  Baskets
                </Link>
              </div>

              <Link href={`/${lang}/shop?category=men`} className="gender-cta-btn">
                <span>DÉCOUVRIR HOMME</span>
                <ArrowRight size={16} className="cta-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gender-split-section {
          padding: 40px 0 20px;
          background-color: #faf9f6;
        }

        .gender-split-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }

        .gender-card {
          position: relative;
          height: 480px;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 40px;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gender-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.16);
        }

        .gender-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gender-card:hover .gender-bg-img {
          transform: scale(1.06);
        }

        .gender-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(11, 13, 18, 0.1) 0%, rgba(11, 13, 18, 0.5) 45%, rgba(11, 13, 18, 0.92) 100%);
          transition: background 0.4s ease;
        }

        .gender-card:hover .gender-overlay {
          background: linear-gradient(180deg, rgba(11, 13, 18, 0.15) 0%, rgba(11, 13, 18, 0.55) 40%, rgba(11, 13, 18, 0.95) 100%);
        }

        .gender-content {
          position: relative;
          z-index: 2;
          color: #ffffff;
          max-width: 500px;
        }

        .gender-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          padding: 5px 12px;
          border-radius: 9999px;
          margin-bottom: 14px;
        }

        .gender-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(28px, 3.2vw, 38px);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.8px;
          margin: 0 0 10px 0;
          line-height: 1.15;
        }

        .gender-desc {
          font-size: 14.5px;
          line-height: 1.55;
          color: #e2e8f0;
          margin: 0 0 20px 0;
          font-weight: 400;
        }

        .gender-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .gender-pill {
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 13px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .gender-pill:hover {
          background: #ffffff;
          color: #0b0d12;
          transform: translateY(-2px);
        }

        .gender-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          color: #0b0d12;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.5px;
          padding: 13px 26px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .gender-cta-btn:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
        }

        .cta-arrow {
          transition: transform 0.25s ease;
        }

        .gender-cta-btn:hover .cta-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .gender-split-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .gender-card {
            height: 420px;
            padding: 30px;
          }
        }

        @media (max-width: 480px) {
          .gender-card {
            height: 380px;
            padding: 24px;
            border-radius: 20px;
          }
          .gender-desc {
            display: none;
          }
          .gender-cta-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
