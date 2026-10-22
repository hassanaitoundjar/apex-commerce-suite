"use client";

import React, { useState } from "react";
import { Sparkles, Mail, Check, Copy, ArrowRight } from "lucide-react";

interface VipNewsletterProps {
  promoCode?: string;
  promoDiscount?: number;
}

export default function VipNewsletter({
  promoCode = "WELCOME10",
  promoDiscount = 10,
}: VipNewsletterProps) {
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
    <section className="vip-newsletter-section">
      <div className="container">
        <div className="vip-newsletter-card">
          <div className="vip-content">
            <div className="vip-badge">
              <Sparkles size={14} />
              <span>CLUB PRIVILÈGE STYLE</span>
            </div>

            <h2 className="vip-title">
              Rejoignez le Club &amp; Obtenez -{promoDiscount}%
            </h2>

            <p className="vip-desc">
              Accédez avant tout le monde à nos lancements exclusifs, ventes privées de fin de saison et conseils mode de nos stylistes.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="vip-form">
                <div className="input-wrap">
                  <Mail size={18} className="mail-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre adresse email..."
                    required
                    className="vip-input"
                  />
                </div>
                <button type="submit" className="vip-submit-btn">
                  <span>S&apos;inscrire</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="vip-success-box">
                <div className="success-icon">
                  <Check size={20} />
                </div>
                <div>
                  <h4 className="success-title">Bienvenue dans le Club !</h4>
                  <p className="success-text">
                    Voici votre code de bienvenue pour profiter de -{promoDiscount}% :
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="copy-coupon-btn"
                  >
                    <code>{promoCode}</code>
                    {copied ? (
                      <span className="copied-status">
                        <Check size={14} /> Copié !
                      </span>
                    ) : (
                      <span className="copy-action">
                        <Copy size={14} /> Copier le code
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            <span className="vip-privacy-note">
              🔒 Vos données sont strictement confidentielles. Désinscription en 1 clic.
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vip-newsletter-section {
          padding: 60px 0 80px;
          background: #faf9f6;
        }

        .vip-newsletter-card {
          background: linear-gradient(135deg, #0b0d12 0%, #171b26 100%);
          border-radius: 28px;
          padding: 60px 30px;
          color: #ffffff;
          box-shadow: 0 25px 60px rgba(11, 13, 18, 0.25);
          position: relative;
          overflow: hidden;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .vip-content {
          max-width: 620px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .vip-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #f59e0b;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 5px 14px;
          border-radius: 9999px;
          margin-bottom: 16px;
        }

        .vip-title {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(26px, 3.4vw, 40px);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.8px;
          line-height: 1.15;
        }

        .vip-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0 0 32px 0;
          max-width: 520px;
        }

        .vip-form {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 500px;
          margin-bottom: 18px;
        }

        .input-wrap {
          position: relative;
          flex-grow: 1;
        }

        .mail-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .vip-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          padding: 14px 20px 14px 46px;
          font-size: 14px;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .vip-input:focus {
          background: rgba(255, 255, 255, 0.14);
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
        }

        .vip-input::placeholder {
          color: #94a3b8;
        }

        .vip-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #0b0d12;
          border: none;
          padding: 14px 26px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
        }

        .vip-submit-btn:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
        }

        .vip-success-box {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: 18px;
          padding: 20px 28px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          text-align: left;
        }

        .success-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #10b981;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .success-title {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
        }

        .success-text {
          font-size: 13px;
          color: #cbd5e1;
          margin: 0 0 8px 0;
        }

        .copy-coupon-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #0b0d12;
          border: none;
          border-radius: 8px;
          padding: 6px 14px;
          cursor: pointer;
          font-size: 12.5px;
          font-weight: 700;
          transition: transform 0.2s ease;
        }

        .copy-coupon-btn:hover {
          transform: scale(1.05);
        }

        .copy-coupon-btn code {
          color: #c2410c;
          font-size: 13px;
        }

        .copied-status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #10b981;
        }

        .copy-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
        }

        .vip-privacy-note {
          font-size: 11.5px;
          color: #94a3b8;
        }

        @media (max-width: 640px) {
          .vip-newsletter-card {
            padding: 40px 20px;
            border-radius: 20px;
          }
          .vip-form {
            flex-direction: column;
            gap: 12px;
          }
          .vip-submit-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
