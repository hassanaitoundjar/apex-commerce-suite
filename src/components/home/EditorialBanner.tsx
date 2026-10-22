"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Feather, Compass } from "lucide-react";

interface EditorialBannerProps {
  lang: string;
}

export default function EditorialBanner({ lang }: EditorialBannerProps) {
  return (
    <section className="editorial-banner-section">
      <div className="container">
        <div className="editorial-grid">
          {/* Visual Showcase: Overlapping High-Fashion Photos */}
          <div className="editorial-visual-wrap">
            <div className="editorial-img-primary">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85"
                alt="Costume Tailleur Luxe Homme"
                className="ed-img"
                loading="lazy"
              />
            </div>
            <div className="editorial-img-secondary">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85"
                alt="Robe Soie Haute Couture Femme"
                className="ed-img"
                loading="lazy"
              />
            </div>
            <div className="editorial-floating-stamp">
              <Compass size={22} className="stamp-icon" />
              <span>ATELIER 2026</span>
            </div>
          </div>

          {/* Editorial Content Text Block */}
          <div className="editorial-content">
            <span className="ed-eyebrow">SAVOIR-FAIRE & EXCELLENCE</span>
            <h2 className="ed-title">
              L&apos;Art de la Coupe &amp; des Matières Nobles
            </h2>
            <p className="ed-lead">
              Conçues à la croisée du tailoring classique et du streetwear contemporain, nos collections célèbrent la précision des lignes, l&apos;authenticité des fibres et l&apos;élégance sans compromis.
            </p>

            <div className="ed-features-list">
              <div className="ed-feature-item">
                <div className="feature-icon-box">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="feature-heading">Fils &amp; Tissus d&apos;Origine Certifiée</h4>
                  <p className="feature-text">Laine vierge thermorégulatrice, lin d&apos;Europe et soie végétale sourcés auprès de filatures éco-responsables.</p>
                </div>
              </div>

              <div className="ed-feature-item">
                <div className="feature-icon-box">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="feature-heading">Silhouettes Architecturales Homme &amp; Femme</h4>
                  <p className="feature-text">Des coupes nettes pensées pour accompagner chaque mouvement avec aisance et prestance.</p>
                </div>
              </div>

              <div className="ed-feature-item">
                <div className="feature-icon-box">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="feature-heading">Séries Limitées &amp; Finitions Soignées</h4>
                  <p className="feature-text">Chaque création est produite en quantité maîtrisée pour préserver sa rareté et minimiser notre empreinte carbone.</p>
                </div>
              </div>
            </div>

            <div className="ed-actions">
              <Link href={`/${lang}/shop`} className="btn-editorial-primary">
                <span>DÉCOUVRIR LE LOOKBOOK</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .editorial-banner-section {
          padding: 80px 0;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .editorial-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: center;
        }

        .editorial-visual-wrap {
          position: relative;
          height: 520px;
        }

        .editorial-img-primary {
          position: absolute;
          left: 0;
          top: 0;
          width: 72%;
          height: 440px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
          border: 1px solid #e2e8f0;
        }

        .editorial-img-secondary {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 58%;
          height: 380px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.18);
          border: 4px solid #ffffff;
        }

        .ed-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .editorial-img-primary:hover .ed-img,
        .editorial-img-secondary:hover .ed-img {
          transform: scale(1.05);
        }

        .editorial-floating-stamp {
          position: absolute;
          top: 30px;
          right: 30px;
          background: #0f172a;
          color: #ffffff;
          border-radius: 50%;
          width: 90px;
          height: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          z-index: 10;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-align: center;
          border: 2px dashed rgba(255, 255, 255, 0.3);
        }

        .editorial-content {
          max-width: 540px;
        }

        .ed-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 1.2px;
          margin-bottom: 10px;
        }

        .ed-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(28px, 3.4vw, 40px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px 0;
          line-height: 1.15;
          letter-spacing: -0.8px;
        }

        .ed-lead {
          font-size: 15.5px;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 28px 0;
        }

        .ed-features-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 34px;
        }

        .ed-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .feature-icon-box {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feature-heading {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 3px 0;
        }

        .feature-text {
          font-size: 13px;
          line-height: 1.45;
          color: #64748b;
          margin: 0;
        }

        .btn-editorial-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #0f172a;
          color: #ffffff;
          font-weight: 700;
          font-size: 13.5px;
          padding: 14px 30px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
        }

        .btn-editorial-primary:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.3);
        }

        @media (max-width: 960px) {
          .editorial-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .editorial-visual-wrap {
            height: 420px;
          }
          .editorial-img-primary {
            height: 340px;
          }
          .editorial-img-secondary {
            height: 280px;
          }
        }

        @media (max-width: 640px) {
          .editorial-banner-section {
            padding: 50px 0;
          }
          .editorial-visual-wrap {
            display: none;
          }
          .btn-editorial-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
