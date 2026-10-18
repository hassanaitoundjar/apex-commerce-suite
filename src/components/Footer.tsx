"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function Footer({ initialSettings }: { initialSettings?: any }) {
  const pathname = usePathname();
  const { t, settings: contextSettings } = useApp();
  const settings = initialSettings || contextSettings || {};

  const storeName = settings.storeName || "SnapShop";
  const footerAbout = settings.footerAbout || "Explore our latest collection of premium fashion designed for the modern woman.";
  const footerEmail = settings.footerEmail || "support@snapshop.com";
  const footerPhone = settings.footerPhone || "+1 (234) 567-890";
  const footerAddress = settings.footerAddress || "123 Fashion Blvd, NY";
  const footerCopyright = settings.footerCopyright || `${storeName}. All rights reserved.`;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const segments = pathname?.split("/").filter(Boolean) || [];
  const locales = [
    "en", "ar", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko", "tr", "nl",
    "hi", "bn", "pa", "vi", "pl", "uk", "ro", "el", "cs", "hu", "sv", "id", "ms",
    "th", "fa", "he", "no", "da", "fi", "sk", "bg", "hr", "sr", "lt", "lv", "et",
    "sl", "ga", "mt", "is", "al", "ge", "am", "az", "kk", "uz", "tl", "ur"
  ];
  const langPrefix = segments.length > 0 && locales.includes(segments[0]) ? `/${segments[0]}` : "";

  return (
    <footer id="contact" style={styles.footer}>
      <div className="container footer-grid-responsive" style={styles.footerGrid}>
        <div>
          <h3 style={styles.logo}>{storeName}</h3>
          <p style={styles.text}>
            {t(footerAbout)}
          </p>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Shop")}</h4>
          <ul style={styles.list}>
            <li><Link href={`${langPrefix}/shop?category=dresses`} style={styles.link}>{t("Dresses") || t("Shop Collection")}</Link></li>
            <li><Link href={`${langPrefix}/shop?category=accessories`} style={styles.link}>{t("Accessories")}</Link></li>
            <li><Link href={`${langPrefix}/shop?category=shoes`} style={styles.link}>{t("Shoes")}</Link></li>
            <li><Link href={`${langPrefix}/shop?category=new`} style={styles.link}>{t("New Arrivals")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Company")}</h4>
          <ul style={styles.list}>
            <li><Link href={`${langPrefix}/#about`} style={styles.link}>{t("About Us")}</Link></li>
            <li><Link href={`${langPrefix}/contact`} style={styles.link}>{t("Contact")}</Link></li>
            <li><Link href={`${langPrefix}/pages/privacy-policy`} style={styles.link}>{t("Privacy Policy")}</Link></li>
            <li><Link href={`${langPrefix}/pages/terms-of-service`} style={styles.link}>{t("Terms of Service")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={styles.heading}>{t("Contact")}</h4>
          <p style={styles.text}>{t("Email")}: <a href={`mailto:${footerEmail}`} style={styles.link}>{footerEmail}</a></p>
          <p style={styles.text}>{t("Phone")}: <a href={`tel:${footerPhone.replace(/\s+/g, "")}`} style={styles.link}>{footerPhone}</a></p>
          <p style={styles.text}>{t("Address")}: {footerAddress}</p>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} {footerCopyright}</p>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: "#111111",
    color: "#ffffff",
    padding: "60px 0 30px",
    marginTop: "80px",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "clamp(24px, 4vw, 40px)",
  },
  logo: {
    fontFamily: "var(--font-sans)",
    fontSize: "24px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "16px",
  },
  text: {
    color: "#aaaaaa",
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "8px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#aaaaaa",
    fontSize: "14px",
    display: "inline-block",
    marginBottom: "12px",
    transition: "color 0.2s ease",
  },
  bottom: {
    borderTop: "1px solid #222222",
    marginTop: "40px",
    paddingTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#666666",
  },
};
