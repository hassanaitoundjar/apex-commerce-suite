"use client";

import React from "react";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { ArrowRight, Sparkles, Star, ShieldCheck, Flame } from "lucide-react";

interface FashionHeroProps {
  lang: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  countdownDate?: string | Date;
  currency?: string;
}

export default function FashionHero({
  lang,
  heroTitle = "L'Élégance Contemporaine : Homme & Femme",
  heroSubtitle = "Explorez notre collection exclusive alliant coupe impeccable, matières d'exception et allure contemporaine.",
  heroImageUrl,
  countdownDate,
  currency = "MAD",
}: FashionHeroProps) {
  return (
    <section className="fashion-hero-section">
      <div className="hero-ambient-glow" />

      <div className="container hero-inner-container">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="hero-content-col">
          <div className="hero-eyebrow">
            <span className="eyebrow-pill">
              <Sparkles size={13} className="eyebrow-icon" />
              NOUVELLE COLLECTION 2026
            </span>
            <span className="eyebrow-sub">PRÊT-À-PORTER LUXE</span>
          </div>

          <h1 className="hero-main-title">
            {heroTitle}
          </h1>

          <p className="hero-main-subtitle">
            {heroSubtitle}
          </p>

          {/* Flash Drop Countdown */}
          {countdownDate && (
            <div className="hero-countdown-box">
              <div className="countdown-header">
                <Flame size={16} className="flame-icon" />
                <span>VENTE PRIVÉE LIMITÉE — FIN DANS :</span>
              </div>
              <Countdown
                targetDate={
                  typeof countdownDate === "string"
                    ? countdownDate
                    : countdownDate?.toISOString?.()
                }
              />
            </div>
          )}

          {/* Dual CTAs for Men and Women */}
          <div className="hero-actions-group">
            <Link
              href={`/${lang}/shop?category=women`}
              className="btn-hero-primary"
            >
              <span>DÉCOUVRIR FEMME</span>
              <ArrowRight size={17} className="btn-arrow" />
            </Link>

            <Link
              href={`/${lang}/shop?category=men`}
              className="btn-hero-secondary"
            >
              <span>DÉCOUVRIR HOMME</span>
              <ArrowRight size={17} className="btn-arrow" />
            </Link>

            <Link
              href={`/${lang}/shop?filter=sale`}
              className="btn-hero-sale"
            >
              <Flame size={15} />
              <span>OFFRES FLASH</span>
            </Link>
          </div>

          {/* Micro trust stats */}
          <div className="hero-trust-strip">
            <div className="trust-item">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#fbbf24" stroke="#fbbf24" />
                ))}
              </div>
              <span className="trust-text"><strong>4.9/5</strong> (3 200+ avis vérifiés)</span>
            </div>
            <span className="trust-divider">•</span>
            <div className="trust-item">
              <ShieldCheck size={16} className="trust-icon" />
              <span className="trust-text">Livraison 48h & Retours 30j</span>
            </div>
          </div>
        </div>

        {/* Right Column: Layered Fashion Editorial Visuals */}
        <div className="hero-visual-col">
          <div className="visual-stage">
            {/* Primary Female Model Image */}
            <div className="visual-card primary-card">
              <img
                src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=85"
                alt="Mode Homme et Femme Luxe"
                className="visual-img"
              />
              <div className="card-gradient-overlay" />
              <span className="card-badge">ÉDITION LIMITÉE</span>
            </div>

            {/* Secondary Floating Layer (Male Model) */}
            <div className="visual-card secondary-card">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"
                alt="Collection Femme Défilé"
                className="visual-img"
              />
              <div className="card-gradient-overlay" />
            </div>

            {/* Floating Product Highlight Widget */}
            <Link
              href={`/${lang}/shop?category=jackets`}
              className="floating-product-card"
            >
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=150&q=80"
                alt="Manteau en Laine Vierge"
                className="floating-thumb"
              />
              <div className="floating-details">
                <span className="floating-tag">COUP DE CŒUR</span>
                <span className="floating-title">Manteau Laine Vierge</span>
                <span className="floating-price">299.00 {currency}</span>
              </div>
              <div className="floating-arrow">
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fashion-hero-section {
          position: relative;
          background: radial-gradient(circle at 80% 20%, #1a1e27 0%, #0c0e14 60%, #07080b 100%);
          color: #ffffff;
          padding: 72px 0 90px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .hero-ambient-glow {
          position: absolute;
          top: -120px;
          right: 15%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(194, 65, 12, 0.18) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }

        .hero-inner-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hero-content-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .eyebrow-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #f8fafc;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 6px 14px;
          border-radius: 9999px;
        }

        .eyebrow-sub {
          font-size: 12px;
          color: #94a3b8;
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .hero-main-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(34px, 4.4vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1.2px;
          color: #ffffff;
          margin: 0 0 20px 0;
          text-wrap: balance;
        }

        .hero-main-subtitle {
          font-size: clamp(15px, 1.3vw, 17.5px);
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0 0 28px 0;
          max-width: 580px;
          font-weight: 400;
        }

        .hero-countdown-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 32px;
          width: 100%;
          max-width: 520px;
        }

        .countdown-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #f59e0b;
          margin-bottom: 10px;
        }

        .hero-actions-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 34px;
          width: 100%;
        }

        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #ffffff;
          color: #0b0d12;
          font-weight: 700;
          font-size: 13.5px;
          letter-spacing: 0.5px;
          padding: 15px 28px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
        }

        .btn-hero-primary:hover {
          transform: translateY(-2px);
          background: #f1f5f9;
          box-shadow: 0 15px 35px rgba(255, 255, 255, 0.25);
        }

        .btn-hero-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-weight: 700;
          font-size: 13.5px;
          letter-spacing: 0.5px;
          padding: 14px 28px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: #ffffff;
          transform: translateY(-2px);
        }

        .btn-hero-sale {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.35));
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fca5a5;
          font-weight: 700;
          font-size: 12.5px;
          padding: 14px 22px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .btn-hero-sale:hover {
          background: #ef4444;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .hero-trust-strip {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 520px;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars-row {
          display: flex;
          gap: 2px;
        }

        .trust-text {
          font-size: 13px;
          color: #94a3b8;
        }

        .trust-text strong {
          color: #ffffff;
        }

        .trust-divider {
          color: rgba(255, 255, 255, 0.2);
        }

        .trust-icon {
          color: #10b981;
        }

        /* Right Visual Stage */
        .hero-visual-col {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .visual-stage {
          position: relative;
          width: 100%;
          max-width: 480px;
          height: 540px;
        }

        .visual-card {
          position: absolute;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .primary-card {
          width: 78%;
          height: 480px;
          left: 0;
          top: 0;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .secondary-card {
          width: 60%;
          height: 380px;
          right: 0;
          bottom: 0;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .visual-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .card-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(7, 8, 11, 0.7) 100%);
          pointer-events: none;
        }

        .card-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* Floating widget */
        .floating-product-card {
          position: absolute;
          bottom: 24px;
          left: -20px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 18px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          z-index: 10;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s ease, background 0.3s ease;
          max-width: 290px;
        }

        .floating-product-card:hover {
          transform: translateY(-4px);
          background: rgba(15, 23, 42, 0.96);
          border-color: #f59e0b;
        }

        .floating-thumb {
          width: 48px;
          height: 56px;
          object-fit: cover;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .floating-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .floating-tag {
          font-size: 9.5px;
          font-weight: 700;
          color: #f59e0b;
          letter-spacing: 0.5px;
        }

        .floating-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .floating-price {
          font-size: 12.5px;
          font-weight: 600;
          color: #cbd5e1;
        }

        .floating-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin-left: auto;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .hero-inner-container {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-visual-col {
            display: none;
          }
          .hero-content-col {
            align-items: center;
            text-align: center;
          }
          .hero-eyebrow {
            justify-content: center;
          }
          .hero-main-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-countdown-box {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-actions-group {
            justify-content: center;
          }
          .hero-trust-strip {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .fashion-hero-section {
            padding: 44px 0 60px;
          }
          .hero-actions-group {
            flex-direction: column;
            gap: 10px;
          }
          .btn-hero-primary,
          .btn-hero-secondary,
          .btn-hero-sale {
            width: 100%;
            justify-content: center;
          }
          .hero-trust-strip {
            flex-direction: column;
            gap: 8px;
          }
          .trust-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
