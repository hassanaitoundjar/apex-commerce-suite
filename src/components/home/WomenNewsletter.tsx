"use client";

import React, { useState } from "react";
import { Sparkles, Mail, Check, Copy, ArrowRight, ShieldCheck, Gem, Gift } from "lucide-react";

interface WomenNewsletterProps {
  promoCode?: string;
  promoDiscount?: number;
}

export default function WomenNewsletter({
  promoCode = "WELCOME10",
  promoDiscount = 10,
}: WomenNewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubmitted(true);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="women-newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          {/* Ambient decorative glowing backdrops */}
          <div className="glow-orb orb-1" />
          <div className="glow-orb orb-2" />

          <div className="newsletter-content">
            <div className="badge-wrapper">
              <span className="privilege-badge">
                <Sparkles size={14} className="sparkle-icon" />
                <span>LE SALON PRIVÉ FEMME</span>
              </span>
            </div>

            <h2 className="newsletter-title">
              Rejoignez le Cercle Privé &amp; Bénéficiez de -{promoDiscount}%
            </h2>

            <p className="newsletter-desc">
              Recevez en avant-première nos défilés capsules, invitations exclusives aux ventes privées confidentielles et sélections sur-mesure de notre salon de style.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="input-box">
                  <Mail size={18} className="mail-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email personnelle..."
                    required
                    className="newsletter-input"
                  />
                </div>
                <button type="submit" className="newsletter-btn">
                  <span>Rejoindre le Cercle</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="success-card">
                <div className="success-icon-wrap">
                  <Check size={22} />
                </div>
                <div className="success-details">
                  <h4 className="success-heading">Bienvenue dans le Cercle Privé</h4>
                  <p className="success-text">
                    Votre invitation est validée. Profitez de -{promoDiscount}% sur votre première commande avec votre code :
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="copy-btn"
                  >
                    <code className="code-tag">{promoCode}</code>
                    {copied ? (
                      <span className="copied-label">
                        <Check size={14} /> Code copié !
                      </span>
                    ) : (
                      <span className="copy-label">
                        <Copy size={14} /> Copier le code
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="perks-row">
              <div className="perk-item">
                <Gem size={15} className="perk-icon" />
                <span>Pièces Éditions Limitées</span>
              </div>
              <div className="perk-item">
                <Gift size={15} className="perk-icon" />
                <span>Cadeau de Bienvenue</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={15} className="perk-icon" />
                <span>Désinscription en 1 Clic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .women-newsletter-section {
          padding: 40px 0 90px;
          background: #ffffff;
          position: relative;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .newsletter-card {
          position: relative;
          background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 70%, #020617 100%);
          border-radius: 28px;
          padding: 70px 40px;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.25;
        }

        .orb-1 {
          width: 380px;
          height: 380px;
          background: #f59e0b;
          top: -120px;
          left: -80px;
        }

        .orb-2 {
          width: 420px;
          height: 420px;
          background: #ec4899;
          bottom: -150px;
          right: -100px;
        }

        .newsletter-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          margin: 0 auto;
        }

        .badge-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .privilege-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          color: #fbbf24;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .newsletter-title {
          font-size: 2.6rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin: 0 0 18px;
          font-family: var(--font-playfair, "Playfair Display", Georgia, serif);
        }

        .newsletter-desc {
          font-size: 1.05rem;
          line-height: 1.65;
          color: #cbd5e1;
          margin: 0 auto 36px;
          max-width: 620px;
        }

        .newsletter-form {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 560px;
          margin: 0 auto 32px;
        }

        .input-box {
          position: relative;
          flex: 1;
        }

        :global(.mail-icon) {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .newsletter-input {
          width: 100%;
          height: 54px;
          padding: 0 20px 0 50px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .newsletter-input::placeholder {
          color: #94a3b8;
        }

        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.12);
          border-color: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15);
        }

        .newsletter-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 54px;
          padding: 0 28px;
          background: linear-gradient(135deg, #d97706, #b45309);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35);
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(217, 119, 6, 0.5);
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .success-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px;
          padding: 22px 28px;
          max-width: 580px;
          margin: 0 auto 32px;
          text-align: left;
        }

        .success-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #10b981;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .success-details {
          flex: 1;
        }

        .success-heading {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px;
        }

        .success-text {
          font-size: 0.88rem;
          color: #cbd5e1;
          margin: 0 0 12px;
        }

        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px dashed rgba(245, 158, 11, 0.6);
          border-radius: 10px;
          cursor: pointer;
          color: #ffffff;
          transition: all 0.25s ease;
        }

        .copy-btn:hover {
          border-color: #f59e0b;
          background: rgba(0, 0, 0, 0.6);
        }

        .code-tag {
          font-family: monospace;
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.1em;
          color: #fbbf24;
        }

        .copy-label,
        .copied-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .copied-label {
          color: #34d499;
        }

        .perks-row {
          display: flex;
          justify-content: center;
          gap: 28px;
          flex-wrap: wrap;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .perk-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #94a3b8;
        }

        :global(.perk-icon) {
          color: #d97706;
        }

        @media (max-width: 768px) {
          .newsletter-card {
            padding: 48px 24px;
            border-radius: 20px;
          }

          .newsletter-title {
            font-size: 1.9rem;
          }

          .newsletter-form {
            flex-direction: column;
            gap: 12px;
          }

          .input-box {
            width: 100%;
          }

          .newsletter-btn {
            width: 100%;
            justify-content: center;
          }

          .perks-row {
            flex-direction: column;
            gap: 12px;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}
