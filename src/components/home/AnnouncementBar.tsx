"use client";

import React, { useState } from "react";
import { Sparkles, Truck, RotateCcw, Copy, Check } from "lucide-react";

interface AnnouncementBarProps {
  promoCode?: string;
  promoDiscount?: number;
  currency?: string;
}

export default function AnnouncementBar({
  promoCode = "WELCOME10",
  promoDiscount = 10,
  currency = "$",
}: AnnouncementBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="announcement-bar-wrapper">
      <div className="container announcement-bar-container">
        <div className="announcement-left">
          <span className="announcement-badge">
            <Sparkles size={13} className="sparkle-icon" />
            <span>NOUVELLE SAISON 2026</span>
          </span>
          <span className="announcement-text">
            Livraison express offerte dès 150 {currency} • Retours offerts sous 30 jours
          </span>
        </div>

        <div className="announcement-right">
          <span className="promo-label">Code VIP -{promoDiscount}% :</span>
          <button
            type="button"
            onClick={handleCopy}
            className="promo-code-btn"
            title="Cliquez pour copier le code promo"
          >
            <code>{promoCode}</code>
            {copied ? (
              <span className="copied-tag">
                <Check size={12} /> Copié !
              </span>
            ) : (
              <Copy size={12} className="copy-icon" />
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .announcement-bar-wrapper {
          background-color: #0b0d12;
          color: #f1f5f9;
          font-size: 12.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          z-index: 40;
          overflow: hidden;
        }

        .announcement-bar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .announcement-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .announcement-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(135deg, #d97706, #b45309);
          color: #ffffff;
          font-weight: 700;
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 9999px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .announcement-text {
          color: #cbd5e1;
          font-weight: 400;
        }

        .announcement-right {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .promo-label {
          color: #94a3b8;
          font-size: 12px;
        }

        .promo-code-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px dashed rgba(255, 255, 255, 0.25);
          color: #f8fafc;
          padding: 3px 9px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11.5px;
          transition: all 0.2s ease;
        }

        .promo-code-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: #f59e0b;
        }

        .promo-code-btn code {
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #fcd34d;
        }

        .copied-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #4ade80;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .announcement-bar-container {
            justify-content: center;
            text-align: center;
            padding: 6px 12px;
          }
          .announcement-right {
            margin-left: 0;
          }
          .announcement-text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
