"use client";

import React from "react";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

interface TrustFeaturesProps {
  currency?: string;
}

export default function TrustFeatures({ currency = "MAD" }: TrustFeaturesProps) {
  const perks = [
    {
      icon: <Truck size={28} className="perk-icon" />,
      title: "Livraison Express Offerte",
      text: `Dès 150 ${currency} d'achat. Expédition sécurisée avec suivi en temps réel sous 48-72h.`,
    },
    {
      icon: <ShieldCheck size={28} className="perk-icon" />,
      title: "Authenticité 100% Garantie",
      text: "Chaque pièce est rigoureusement certifiée et issue de filières textiles d'excellence.",
    },
    {
      icon: <RotateCcw size={28} className="perk-icon" />,
      title: "Retours Gratuits 30 Jours",
      text: "Essayez à domicile l'esprit tranquille. Échange simplifié ou remboursement immédiat.",
    },
    {
      icon: <Headphones size={28} className="perk-icon" />,
      title: "Conciergerie VIP 7j/7",
      text: "Une équipe d'experts dédiée pour vous guider dans le choix de vos coupes et tailles.",
    },
  ];

  return (
    <section className="trust-features-section">
      <div className="container">
        <div className="trust-grid">
          {perks.map((p, idx) => (
            <div key={idx} className="trust-card">
              <div className="trust-icon-container">
                {p.icon}
              </div>
              <h3 className="trust-title">{p.title}</h3>
              <p className="trust-desc">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .trust-features-section {
          padding: 60px 0;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }

        .trust-card {
          padding: 28px 20px;
          border-radius: 20px;
          background: #faf9f6;
          border: 1px solid #f1f5f9;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .trust-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
          border-color: #e2e8f0;
        }

        .trust-icon-container {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ffffff;
          color: #c2410c;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          border: 1px solid #f1f5f9;
        }

        .trust-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .trust-desc {
          font-size: 13.5px;
          line-height: 1.5;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 580px) {
          .trust-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .trust-card {
            padding: 22px 18px;
          }
        }
      `}</style>
    </section>
  );
}
