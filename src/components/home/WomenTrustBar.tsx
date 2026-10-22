"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, Sparkles } from "lucide-react";

interface WomenTrustBarProps {
  currency?: string;
}

export default function WomenTrustBar({ currency = "MAD" }: WomenTrustBarProps) {
  const perks = [
    {
      icon: <Truck size={26} className="perk-icon" />,
      title: "Livraison Express Offerte",
      text: `Dès 150 ${currency} d'achat. Expédition soignée dans notre boîte signature sous 48-72h.`,
    },
    {
      icon: <ShieldCheck size={26} className="perk-icon" />,
      title: "Authenticité & Coupe Garantie",
      text: "Confection haute précision, matières pures sélectionnées et finitions haute couture.",
    },
    {
      icon: <RotateCcw size={26} className="perk-icon" />,
      title: "30 Jours d'Essai Serein",
      text: "Retours et échanges simples et gratuits à domicile sans aucune complication.",
    },
    {
      icon: <Sparkles size={26} className="perk-icon" />,
      title: "Conseil Styliste Dédié",
      text: "Notre équipe vous oriente personnellement 7j/7 pour trouver la coupe et taille idéales.",
    },
  ];

  return (
    <section className="women-trust-section">
      <div className="container">
        <div className="trust-four-grid">
          {perks.map((p, idx) => (
            <div key={idx} className="trust-box">
              <div className="trust-icon-wrap">
                {p.icon}
              </div>
              <h3 className="trust-heading">{p.title}</h3>
              <p className="trust-detail">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .women-trust-section {
          padding: 60px 0;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .trust-four-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }

        .trust-box {
          padding: 28px 20px;
          border-radius: 20px;
          background: #faf8f5;
          border: 1px solid #f1f5f9;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .trust-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 28px rgba(190, 24, 93, 0.08);
          border-color: #fce7f3;
        }

        .trust-icon-wrap {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #ffffff;
          color: #be185d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          border: 1px solid #fce7f3;
        }

        .trust-heading {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 15.5px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .trust-detail {
          font-size: 13.5px;
          line-height: 1.5;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .trust-four-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 540px) {
          .trust-four-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .trust-box {
            padding: 22px 18px;
          }
        }
      `}</style>
    </section>
  );
}
