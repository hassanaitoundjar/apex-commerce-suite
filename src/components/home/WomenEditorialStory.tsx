"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Feather, ShieldCheck, HeartHandshake } from "lucide-react";

interface WomenEditorialStoryProps {
  lang: string;
}

export default function WomenEditorialStory({ lang }: WomenEditorialStoryProps) {
  return (
    <section className="women-editorial-section">
      <div className="container">
        <div className="editorial-layout">
          {/* Visual Side */}
          <div className="editorial-stage">
            <div className="img-frame-back">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85"
                alt="Robe de Soie Féminine"
                className="stage-img"
                loading="lazy"
              />
            </div>
            <div className="img-frame-front">
              <img
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=85"
                alt="Cachemire Doux Femme"
                className="stage-img"
                loading="lazy"
              />
            </div>
            <div className="atelier-crest">
              <Sparkles size={20} className="crest-icon" />
              <span className="crest-year">ATELIER 2026</span>
              <span className="crest-text">PARIS • MILAN</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="editorial-content">
            <span className="ed-eyebrow">SAVOIR-FAIRE &amp; MATIÈRES NOBLES</span>
            <h2 className="ed-title">
              L&apos;Éloge de la Silhouette Féminine
            </h2>
            <p className="ed-lead">
              Chaque création de notre maison est conçue comme un hymne à la féminité moderne. Une harmonie parfaite entre fluidité de la soie, chaleur enveloppante du cachemire et rigueur d&apos;un patronage sur-mesure.
            </p>

            <div className="features-stack">
              <div className="feat-box">
                <div className="feat-icon-wrap">
                  <Feather size={18} />
                </div>
                <div>
                  <h4 className="feat-title">Fibres Nobles &amp; Éco-Certifiées</h4>
                  <p className="feat-desc">Satin de soie végétale 19 mommes, cachemire peigné de Mongolie et gabardine de coton biologique.</p>
                </div>
              </div>

              <div className="feat-box">
                <div className="feat-icon-wrap">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="feat-title">Coupes Sculpturales &amp; Confort Absolu</h4>
                  <p className="feat-desc">Des patrons étudiés pour sublimer chaque morphologie féminine avec aisance et distinction.</p>
                </div>
              </div>

              <div className="feat-box">
                <div className="feat-icon-wrap">
                  <HeartHandshake size={18} />
                </div>
                <div>
                  <h4 className="feat-title">Séries Numérotées &amp; Finitions Main</h4>
                  <p className="feat-desc">Micro-productions raisonnées pour garantir l&apos;exclusivité de vos tenues et respecter nos ateliers.</p>
                </div>
              </div>
            </div>

            <div className="ed-action-wrap">
              <Link href={`/${lang}/shop`} className="btn-lookbook">
                <span>DÉCOUVRIR LE LOOKBOOK</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .women-editorial-section {
          padding: 84px 0;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .editorial-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }

        .editorial-stage {
          position: relative;
          height: 520px;
        }

        .img-frame-back {
          position: absolute;
          left: 0;
          top: 0;
          width: 72%;
          height: 440px;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
        }

        .img-frame-front {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 58%;
          height: 380px;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 25px 55px rgba(190, 24, 93, 0.16);
          border: 4px solid #ffffff;
        }

        .stage-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .img-frame-back:hover .stage-img,
        .img-frame-front:hover .stage-img {
          transform: scale(1.06);
        }

        .atelier-crest {
          position: absolute;
          top: 25px;
          right: 25px;
          background: #090a0d;
          color: #ffffff;
          border-radius: 50%;
          width: 95px;
          height: 95px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
          z-index: 10;
          border: 2px dashed rgba(244, 114, 182, 0.4);
          text-align: center;
        }

        .crest-icon {
          color: #f472b6;
        }

        .crest-year {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
          margin-top: 2px;
        }

        .crest-text {
          font-size: 7.5px;
          color: #94a3b8;
          letter-spacing: 0.8px;
        }

        .editorial-content {
          max-width: 540px;
        }

        .ed-eyebrow {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #be185d;
          letter-spacing: 1.2px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .ed-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(28px, 3.4vw, 42px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px 0;
          line-height: 1.15;
          letter-spacing: -0.8px;
        }

        .ed-lead {
          font-size: 15.5px;
          line-height: 1.65;
          color: #475569;
          margin: 0 0 28px 0;
        }

        .features-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 34px;
        }

        .feat-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .feat-icon-wrap {
          color: #be185d;
          background: rgba(190, 24, 93, 0.1);
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .feat-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 3px 0;
        }

        .feat-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #64748b;
          margin: 0;
        }

        .btn-lookbook {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #090a0d;
          color: #ffffff;
          font-weight: 700;
          font-size: 13.5px;
          padding: 14px 30px;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 20px rgba(9, 10, 13, 0.2);
        }

        .btn-lookbook:hover {
          background: #be185d;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(190, 24, 93, 0.35);
        }

        @media (max-width: 960px) {
          .editorial-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .editorial-stage {
            height: 420px;
          }
          .img-frame-back {
            height: 340px;
          }
          .img-frame-front {
            height: 280px;
          }
        }

        @media (max-width: 640px) {
          .women-editorial-section {
            padding: 50px 0;
          }
          .editorial-stage {
            display: none;
          }
          .btn-lookbook {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
