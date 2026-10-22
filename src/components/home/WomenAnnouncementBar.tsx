"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

interface WomenAnnouncementBarProps {
  promoCode?: string;
  promoDiscount?: number;
  currency?: string;
}

export default function WomenAnnouncementBar({
  promoCode = "WELCOME10",
  promoDiscount = 10,
  currency = "MAD",
}: WomenAnnouncementBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="women-announcement-bar">
      <div className="container announcement-inner">
        {/* Left marquee / message */}
        <div className="announcement-message">
          <span className="announcement-pill">
            <Sparkles size={12} className="sparkle-anim" />
            <span>COLLECTION FEMME 2026</span>
          </span>
          <span className="announcement-text">
            Livraison express offerte dès 150 {currency} • Retours et échanges gratuits sous 30 jours
          </span>
        </div>

        {/* Right promo code copy */}
        <div className="announcement-action">
          <span className="code-label">Offre Bienvenue -{promoDiscount}% :</span>
          <button
            type="button"
            onClick={handleCopy}
            className="code-badge-btn"
            title="Copier le code de réduction"
          >
            <code>{promoCode}</code>
            {copied ? (
              <span className="copied-text">
                <Check size={12} /> Copié !
              </span>
            ) : (
              <Copy size={12} className="copy-icon" />
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .women-announcement-bar {
          background-color: #090a0d;
          color: #f8fafc;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          position: relative;
          z-index: 50;
        }

        .announcement-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          gap: 12px;
        }

        .announcement-message {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .announcement-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #be185d 0%, #db2777 100%);
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 2px 9px;
          border-radius: 9999px;
        }

        .sparkle-anim {
          animation: spinPulse 3s infinite ease-in-out;
        }

        @keyframes spinPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.25) rotate(180deg); opacity: 0.8; }
        }

        .announcement-text {
          color: #cbd5e1;
          font-weight: 400;
          letter-spacing: 0.2px;
        }

        .announcement-action {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .code-label {
          color: #94a3b8;
          font-size: 11.5px;
        }

        .code-badge-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px dashed rgba(255, 255, 255, 0.25);
          color: #f8fafc;
          padding: 3px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11.5px;
          transition: all 0.2s ease;
        }

        .code-badge-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: #f472b6;
        }

        .code-badge-btn code {
          font-weight: 700;
          color: #f472b6;
          letter-spacing: 0.5px;
        }

        .copied-text {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #4ade80;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .announcement-text {
            display: none;
          }
          .announcement-inner {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
