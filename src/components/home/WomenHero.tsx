"use client";

import React from "react";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import { ArrowRight, Sparkles, Star, Flame, ShieldCheck } from "lucide-react";

interface WomenHeroProps {
  lang: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  countdownDate?: string | Date;
  currency?: string;
}

export default function WomenHero({
  lang,
  heroTitle = "L'Élégance Féminine Redéfinie",
  heroSubtitle = "Explorez notre nouvelle collection femme 2026 : robes de créateurs, mailles en pur cachemire, trenchs ceinturés et maroquinerie d'exception.",
  heroImageUrl,
  countdownDate,
  currency = "MAD",
}: WomenHeroProps) {
  const targetDateStr =
    typeof countdownDate === "string"
      ? countdownDate
      : countdownDate?.toISOString?.();

  return (
    <section className="women-hero-section">
      {/* Ambient Animated Glow Orbs */}
      <div className="glow-orb glow-top-right" />
      <div className="glow-orb glow-bottom-left" />

      <div className="container hero-grid">
        {/* Left Column: Headline, Description & Actions */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-badge">
              <Sparkles size={13} className="sparkle-icon" />
              NOUVELLE COLLECTION FEMME 2026
            </span>
            <span className="eyebrow-origin">MAISON DE PRÊT-À-PORTER</span>
          </div>

          <h1 className="hero-title">
            {heroTitle}
          </h1>

          <p className="hero-subtitle">
            {heroSubtitle}
          </p>

          {/* Flash Drop Countdown Box */}
          {targetDateStr && (
            <div className="countdown-card">
              <div className="countdown-top-label">
                <Flame size={15} className="flame-icon" />
                <span>VENTE PRIVÉE EXCLUSIVE — FIN DU DROP DANS :</span>
              </div>
              <Countdown targetDate={targetDateStr} />
            </div>
          )}

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <Link href={`/${lang}/shop`} className="btn-primary-luxury">
              <span>EXPLORER LA COLLECTION</span>
              <ArrowRight size={17} className="btn-arrow-motion" />
            </Link>

            <Link href={`/${lang}/shop?category=dresses`} className="btn-secondary-luxury">
              <span>ROBES &amp; SOIRÉE</span>
            </Link>

            <Link href={`/${lang}/shop?filter=sale`} className="btn-sale-badge">
              <Flame size={14} />
              <span>VENTES FLASH (-30%)</span>
            </Link>
          </div>

          {/* Trust proof */}
          <div className="hero-proof-strip">
            <div className="proof-item">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#fbbf24" stroke="#fbbf24" />
                ))}
              </div>
              <span className="proof-text"><strong>4.9/5</strong> (4 800+ avis vérifiés)</span>
            </div>
            <span className="proof-sep">•</span>
            <div className="proof-item">
              <ShieldCheck size={16} className="shield-icon" />
              <span className="proof-text">Confection éthique &amp; Retours 30j</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Fashion Visual Showcase with Layering */}
        <div className="hero-visual-stage">
          <div className="visual-composition">
            {/* Primary Main Model Photo */}
            <div className="main-portrait-frame">
              <img
                src={
                  heroImageUrl ||
                  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85"
                }
                alt="Nouvelle Collection Femme"
                className="main-portrait-img"
              />
              <div className="portrait-vignette" />
              <span className="corner-badge">NOUVELLE SAISON</span>
            </div>

            {/* Floating Handbag Accent Card */}
            <div className="floating-bag-card">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=350&q=80"
                alt="Sac Cuir Italien"
                className="bag-thumb"
              />
              <div className="bag-card-text">
                <span className="bag-label">MAROQUINERIE</span>
                <span className="bag-name">Sac Porté Épaule</span>
                <span className="bag-price">290.00 {currency}</span>
              </div>
            </div>

            {/* Floating Dress Product Badge */}
            <Link href={`/${lang}/shop?category=dresses`} className="floating-hero-pill">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=120&q=80"
                alt="Robe Soie"
                className="pill-thumb"
              />
              <div className="pill-info">
                <span className="pill-tag">COUP DE CŒUR</span>
                <span className="pill-title">Robe Soie Végétale</span>
                <span className="pill-price">220.00 {currency}</span>
              </div>
              <div className="pill-btn">
                <ArrowRight size={13} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .women-hero-section {
          position: relative;
          background: radial-gradient(circle at 75% 25%, #180d19 0%, #0d0e14 55%, #07070a 100%);
          color: #ffffff;
          padding: 76px 0 92px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
        }

        .glow-top-right {
          top: -120px;
          right: 8%;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(190, 24, 93, 0.18) 0%, rgba(219, 39, 119, 0.06) 50%, transparent 70%);
          animation: floatPulse 8s infinite alternate ease-in-out;
        }

        .glow-bottom-left {
          bottom: -80px;
          left: 5%;
          width: 440px;
          height: 440px;
          background: radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%);
          animation: floatPulse 10s infinite alternate-reverse ease-in-out;
        }

        @keyframes floatPulse {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1.15); opacity: 1; }
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .eyebrow-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(190, 24, 93, 0.2);
          border: 1px solid rgba(244, 114, 182, 0.35);
          color: #fbcfe8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 5px 14px;
          border-radius: 9999px;
        }

        .eyebrow-origin {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 1.5px;
        }

        .hero-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(34px, 4.4vw, 56px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1.2px;
          color: #ffffff;
          margin: 0 0 20px 0;
          text-wrap: balance;
        }

        .hero-subtitle {
          font-size: clamp(15px, 1.3vw, 17.5px);
          line-height: 1.65;
          color: #cbd5e1;
          margin: 0 0 30px 0;
          max-width: 580px;
        }

        .countdown-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 18px 22px;
          border-radius: 20px;
          margin-bottom: 34px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .countdown-top-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #f472b6;
          margin-bottom: 10px;
        }

        .flame-icon {
          color: #be185d;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 36px;
          width: 100%;
        }

        .btn-primary-luxury {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          color: #090a0d;
          font-weight: 700;
          font-size: 13.5px;
          letter-spacing: 0.5px;
          padding: 15px 30px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.18);
        }

        .btn-primary-luxury:hover {
          transform: translateY(-2px);
          background: #fdf2f8;
          box-shadow: 0 15px 35px rgba(244, 114, 182, 0.3);
        }

        .btn-arrow-motion {
          transition: transform 0.25s ease;
        }

        .btn-primary-luxury:hover .btn-arrow-motion {
          transform: translateX(4px);
        }

        .btn-secondary-luxury {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          font-weight: 700;
          font-size: 13.5px;
          letter-spacing: 0.5px;
          padding: 14px 28px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-secondary-luxury:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: #ffffff;
          transform: translateY(-2px);
        }

        .btn-sale-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(225, 29, 72, 0.2), rgba(190, 24, 93, 0.35));
          border: 1px solid rgba(244, 114, 182, 0.45);
          color: #fbcfe8;
          font-weight: 700;
          font-size: 12.5px;
          padding: 14px 22px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .btn-sale-badge:hover {
          background: #be185d;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .hero-proof-strip {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 520px;
          flex-wrap: wrap;
        }

        .proof-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars-row {
          display: flex;
          gap: 2px;
        }

        .proof-text {
          font-size: 13px;
          color: #94a3b8;
        }

        .proof-text strong {
          color: #ffffff;
        }

        .proof-sep {
          color: rgba(255, 255, 255, 0.2);
        }

        .shield-icon {
          color: #ec4899;
        }

        /* Right Column: Layered Stage */
        .hero-visual-stage {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .visual-composition {
          position: relative;
          width: 100%;
          max-width: 480px;
          height: 560px;
        }

        .main-portrait-frame {
          position: absolute;
          width: 82%;
          height: 510px;
          left: 0;
          top: 0;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 25px 65px rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.16);
          z-index: 2;
        }

        .main-portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .portrait-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(9, 10, 13, 0.75) 100%);
        }

        .corner-badge {
          position: absolute;
          top: 18px;
          left: 18px;
          background: rgba(9, 10, 13, 0.75);
          backdrop-filter: blur(8px);
          color: #fbcfe8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(244, 114, 182, 0.3);
        }

        /* Floating handbag card */
        .floating-bag-card {
          position: absolute;
          right: 0;
          top: 70px;
          width: 175px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: floatCard 6s infinite ease-in-out alternate;
        }

        @keyframes floatCard {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }

        .bag-thumb {
          width: 100%;
          height: 130px;
          object-fit: cover;
          border-radius: 12px;
        }

        .bag-card-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .bag-label {
          font-size: 9px;
          font-weight: 800;
          color: #f472b6;
          letter-spacing: 0.5px;
        }

        .bag-name {
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
        }

        .bag-price {
          font-size: 12px;
          font-weight: 800;
          color: #e2e8f0;
        }

        /* Floating Dress Product Badge */
        .floating-hero-pill {
          position: absolute;
          bottom: 16px;
          left: -20px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          z-index: 10;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.45);
          transition: transform 0.3s ease, border-color 0.3s ease;
          max-width: 290px;
        }

        .floating-hero-pill:hover {
          transform: translateY(-4px);
          border-color: #f472b6;
        }

        .pill-thumb {
          width: 48px;
          height: 58px;
          object-fit: cover;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .pill-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .pill-tag {
          font-size: 9px;
          font-weight: 800;
          color: #f472b6;
          letter-spacing: 0.5px;
        }

        .pill-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pill-price {
          font-size: 12.5px;
          font-weight: 800;
          color: #f8fafc;
        }

        .pill-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-visual-stage {
            display: none;
          }
          .hero-content {
            align-items: center;
            text-align: center;
          }
          .hero-eyebrow {
            justify-content: center;
          }
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
          .countdown-card {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-cta-group {
            justify-content: center;
          }
          .hero-proof-strip {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .women-hero-section {
            padding: 44px 0 60px;
          }
          .hero-cta-group {
            flex-direction: column;
            gap: 10px;
          }
          .btn-primary-luxury,
          .btn-secondary-luxury,
          .btn-sale-badge {
            width: 100%;
            justify-content: center;
          }
          .hero-proof-strip {
            flex-direction: column;
            gap: 8px;
          }
          .proof-sep {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
